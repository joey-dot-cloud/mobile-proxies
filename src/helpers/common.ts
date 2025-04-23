/**
 * Strip ANSI color codes from a string
 */
export function stripAnsiCodes(str: string): string {
  // This regex matches ANSI escape sequences used for terminal colors and formatting
  return str.replace(/\x1B\[[0-9;]*[mGK]/g, "");
}

/**
 * Helper to extract a value from the mmcli output
 */
export function extractValue(text: string, key: string): string | undefined {
  // Create a more flexible regex that can handle different formatting patterns
  const regex = new RegExp(`${key}\\s*(.*?)(?:$|\\n|\\r|\\|)`, "im");
  const match = text.match(regex);
  return match?.[1]?.trim() ? stripAnsiCodes(match[1].trim()) : undefined;
}
