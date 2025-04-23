import { execa } from 'execa';
import { extractValue, stripAnsiCodes } from './common.js';

export interface Modem {
  index: string;
  path: string;
  manufacturer?: string | undefined;
  model?: string | undefined;
  revision?: string | undefined;
  state?: string | undefined;
  failedReason?: string | undefined;
  signal?: string | undefined;
  simState?: string | undefined;
  operatorName?: string | undefined;
  operatorId?: string | undefined;
  bearers?: string[];
  imei?: string | undefined;
  capabilities?: string[];
  powerState?: string | undefined;
  accessTech?: string | undefined;
  registrationStatus?: string | undefined;
  phoneNumber?: string | undefined;
  simPath?: string | undefined;
}

/**
 * List all available modems using mmcli
 */
export async function listModems(): Promise<Modem[]> {
  try {
    const { stdout } = await execa('mmcli', ['-L']);
    
    // Parse the output to extract modem information
    const modems: Modem[] = [];
    const lines = stdout.split('\n');
    
    for (const line of lines) {
      if (line.includes('/org/freedesktop/ModemManager1/Modem/')) {
        // Extract the DBus path using regex
        const pathMatch = line.match(/\/(org\/freedesktop\/ModemManager1\/Modem\/\d+)/);
        if (pathMatch) {
          const path = '/' + pathMatch[1];
          const index = path.split('/').pop() || '';
          modems.push({ index, path });
        }
      }
    }
    
    // Get detailed info for each modem
    return await Promise.all(modems.map(getModemInfo));
  } catch (error) {
    console.error('Error listing modems:', error);
    return [];
  }
}

/**
 * Get detailed information about a specific modem
 */
async function getModemInfo(modem: Modem): Promise<Modem> {
  try {
    const { stdout } = await execa('mmcli', ['-m', modem.index]);
    
    // Extract information from output
    const manufacturer = extractValue(stdout, 'manufacturer:');
    const model = extractValue(stdout, 'model:');
    const revision = extractValue(stdout, 'firmware revision:') || extractValue(stdout, 'revision:');
    const state = extractValue(stdout, 'state:');
    const failedReason = extractValue(stdout, 'failed reason:');
    const powerState = extractValue(stdout, 'power state:');
    const imei = extractValue(stdout, 'imei:') || extractValue(stdout, 'equipment id:') || extractValue(stdout, 'esn:') || extractValue(stdout, 'meid:');
    const accessTech = extractValue(stdout, 'access tech:');
    const registrationStatus = extractValue(stdout, 'registration:');
    const phoneNumber = extractValue(stdout, 'own:');
    const signal = extractValue(stdout, 'signal quality:');
    
    // Get SIM info if available
    let simState: string | undefined;
    let operatorName: string | undefined;
    let operatorId: string | undefined;
    let simPath: string | undefined;
    
    try {
      // First get the SIM path from modem info
      // Try the "primary sim path" format first (as seen in successful example)
      const primarySimPathMatch = stdout.match(/primary sim path:\s+([^\s]+)/i);
      
      // If not found, try the SIM section format
      const simPathMatch = primarySimPathMatch || stdout.match(/SIM\s+\|[^|]*path:\s+([^\s,\n]+)/i);
      
      // Also try to get operator info directly from modem output
      operatorId = operatorId || extractValue(stdout, 'operator id:');
      operatorName = operatorName || extractValue(stdout, 'operator name:');
      
      if (simPathMatch && simPathMatch[1]) {
        simPath = simPathMatch[1];
        const simIndex = simPath.split('/').pop() || '';
        
        // Then get SIM info using the correct index
        try {
          const { stdout: simOut } = await execa('mmcli', ['-i', simIndex]);
          console.log(simOut);
        
          simState = (extractValue(simOut, 'active:') || extractValue(simOut, 'status:') || extractValue(simOut, 'state:')) == 'yes' ? 'active' : 'inactive';
          operatorName = operatorName || extractValue(simOut, 'operator name:');
          operatorId = operatorId || extractValue(simOut, 'operator id:');
          
        } catch (simError) {
          console.error(`Error getting SIM info for modem ${modem.index}:`, simError);
        }
      } else if (failedReason === 'sim-missing') {
        simState = 'missing';
      }
    } catch (error) {
      console.error(`Error processing SIM info for modem ${modem.index}:`, error);
    }
    
    // Get capabilities
    const capabilities = extractList(stdout, 'supported:') || extractList(stdout, 'capabilities:');
    
    // Get active bearers
    const bearers = await getModemBearers(modem.index);
    
    return {
      ...modem,
      manufacturer,
      model,
      revision,
      state,
      failedReason,
      powerState,
      signal,
      simState,
      operatorName,
      operatorId,
      bearers,
      imei,
      capabilities,
      accessTech,
      registrationStatus,
      phoneNumber,
      simPath
    };
  } catch (error) {
    console.error(`Error getting info for modem ${modem.index}:`, error);
    return modem;
  }
}

/**
 * Get bearer information for a modem
 */
async function getModemBearers(modemIndex: string): Promise<string[]> {
  try {
    const { stdout } = await execa('mmcli', ['-m', modemIndex, '--bearer-list']);
    const bearers: string[] = [];
    
    const lines = stdout.split('\n');
    for (const line of lines) {
      if (line.includes('/org/freedesktop/ModemManager1/Bearer/')) {
        const bearer = line.trim().split(' ').pop();
        if (bearer) bearers.push(bearer);
      }
    }
    
    return bearers;
  } catch {
    return [];
  }
}

/**
 * Helper to extract a list from the mmcli output
 */
function extractList(text: string, key: string): string[] {
  const regex = new RegExp(`${key}\\s+(.+)`);
  const match = text.match(regex);
  if (!match) return [];
  
  return match[1]?.split(',').map(item => stripAnsiCodes(item.trim())) || [];
}

/**
 * Get location information for a modem
 */
export async function getModemLocation(modemIndex: string): Promise<Record<string, string>> {
  try {
    const { stdout } = await execa('mmcli', ['-m', modemIndex, '--location-status']);
    const location: Record<string, string> = {};
    
    // Extract location information
    const capabilities = extractValue(stdout, 'capabilities:');
    const enabled = extractValue(stdout, 'enabled:');
    
    if (capabilities) location['capabilities'] = capabilities;
    if (enabled) location['enabled'] = enabled;
    
    return location;
  } catch {
    return {};
  }
}

/**
 * Enable a modem
 */
export async function enableModem(modemIndex: string): Promise<boolean> {
  try {
    const { stdout, stderr } = await execa('mmcli', ['-m', modemIndex, '--enable']);
    console.debug(stdout, stderr);
    
    return true;
  } catch (error) {
    console.log('xoxox', error);
    
    return false;
  }
}

/**
 * Disable a modem
 */
export async function disableModem(modemIndex: string): Promise<boolean> {
  try {
    await execa('mmcli', ['-m', modemIndex, '--disable']);
    return true;
  } catch {
    return false;
  }
}

/**
 * Reset a modem
 */
export async function resetModem(modemIndex: string): Promise<boolean> {
  try {
    await execa('mmcli', ['-m', modemIndex, '--reset']);
    return true;
  } catch {
    return false;
  }
}
