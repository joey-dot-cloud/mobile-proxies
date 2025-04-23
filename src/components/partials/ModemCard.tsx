import { FC } from 'hono/jsx';
import { Modem } from '../../helpers/modemManager.js';

export interface ModemCardProps {
  modem: Modem;
}

export const ModemCard: FC<ModemCardProps> = ({ modem }) => {
  // Calculate signal strength class
  let signalClass = 'signal-unknown';
  if (modem.signal) {
    const signalNum = parseInt(modem.signal);
    if (signalNum >= 70) signalClass = 'signal-high';
    else if (signalNum >= 40) signalClass = 'signal-medium';
    else signalClass = 'signal-low';
  }

  return (
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          {modem.manufacturer} {modem.model}
          <small class="ms-2 text-muted">#{modem.index}</small>
        </h5>
        {modem.signal && (
          <div>
            <span class={`signal-indicator ${signalClass}`}></span>
            <span>{modem.signal}% Signal</span>
          </div>
        )}
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between">
                <span>State:</span>
                <span class="badge bg-primary">{modem.state || 'Unknown'}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>IMEI:</span>
                <span>{modem.imei || 'N/A'}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>Revision:</span>
                <span>{modem.revision || 'N/A'}</span>
              </li>
            </ul>
          </div>
          <div class="col-md-6">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between">
                <span>SIM State:</span>
                <span>{modem.simState || 'Unknown'}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>Operator:</span>
                <span>{modem.operatorName || 'N/A'}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>Operator ID:</span>
                <span>{modem.operatorId || 'N/A'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <div class="row">
          <div class="col">
            <small>Capabilities: {modem.capabilities?.join(', ') || 'None'}</small>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-auto">
            <a href={`/modem/${modem.index}/enable`} class="btn btn-sm btn-success">Enable</a>
          </div>
          <div class="col-auto">
            <a href={`/modem/${modem.index}/disable`} class="btn btn-sm btn-warning">Disable</a>
          </div>
          <div class="col-auto">
            <a href={`/modem/${modem.index}/reset`} class="btn btn-sm btn-danger">Reset</a>
          </div>
        </div>
      </div>
    </div>
  );
};
