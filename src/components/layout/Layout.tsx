import { FC } from 'hono/jsx';

export const Layout: FC = (props) => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Modem Dashboard</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
        <style>{`
          body {
            padding-top: 1.5rem;
            padding-bottom: 1.5rem;
            background-color: #f8f9fa;
          }
          .header {
            padding-bottom: 1rem;
            border-bottom: 1px solid #e5e5e5;
            margin-bottom: 2rem;
          }
          .card {
            margin-bottom: 1.5rem;
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          }
          .signal-indicator {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 5px;
          }
          .signal-high {
            background-color: #28a745;
          }
          .signal-medium {
            background-color: #ffc107;
          }
          .signal-low {
            background-color: #dc3545;
          }
          .signal-unknown {
            background-color: #6c757d;
          }
        `}</style>
      </head>
      <body>
        <div class="container">
          <div class="header d-flex justify-content-between align-items-center">
            <h1>Modem Dashboard</h1>
            <div class="refresh-button">
              <a href="/" class="btn btn-outline-primary">Refresh</a>
            </div>
          </div>
          {props['children']}
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  );
};
