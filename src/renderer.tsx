import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hono - Dashboard</title>
        <script src="/static/js/theme.js"></script>
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
});
