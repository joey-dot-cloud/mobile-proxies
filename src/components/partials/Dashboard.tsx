import { FC } from 'hono/jsx';
import { Modem } from '../../helpers/modemManager.js';
import { ModemCard } from './ModemCard.js';

export interface DashboardProps {
  modems: Modem[];
}

export const Dashboard: FC<DashboardProps> = ({ modems }) => {
  return (
    <div class="dashboard">
      {modems.length === 0 ? (
        <div class="alert alert-info" role="alert">
          No modems detected. Make sure ModemManager is running and modems are connected.
        </div>
      ) : (
        <div class="row">
          {modems.map((modem) => (
            <div class="col-lg-6">
              <ModemCard modem={modem} />
            </div>
          ))}
        </div>
      )}
      <div class="card mt-4">
        <div class="card-header">
          <h5 class="mb-0">Modem Management</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="d-grid gap-2">
                <a href="/scan-modems" class="btn btn-primary">Scan for New Modems</a>
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-grid gap-2">
                <a href="/monitor-modems" class="btn btn-secondary">Monitor Modems</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
