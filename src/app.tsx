import 'dotenv/config'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { execa } from 'execa'
import './loaders/logger.js'
import { Layout } from './components/layout/Layout.js'
import { Dashboard } from './components/partials/Dashboard.js'
import { 
  listModems, 
  enableModem, 
  disableModem, 
  resetModem 
} from './helpers/modemManager.js'
import { renderer } from "./renderer.js";

const app = new Hono()
app.use("*", renderer);
app.use('*', serveStatic({ root: './src/public' }))

// Routes
app.get('/', async (c) => {
  const modems = await listModems()
  //console.debug(modems);
  
  return c.render(
    <Layout>
      <Dashboard modems={modems} />
    </Layout>
  )
})

// Modem control routes
app.get('/modem/:id/enable', async (c) => {
  const id = c.req.param('id')
  await enableModem(id)
  return c.redirect('/')
})

app.get('/modem/:id/disable', async (c) => {
  const id = c.req.param('id')
  await disableModem(id)
  return c.redirect('/')
})

app.get('/modem/:id/reset', async (c) => {
  const id = c.req.param('id')
  await resetModem(id)
  return c.redirect('/')
})

//TODO check usage for this
// Scan for new modems
app.get('/scan-modems', async (c) => {
  try { 
    await execa('mmcli', ['-S'])
  } catch (error) {
    console.error('Error scanning for modems:', error)
  }
  return c.redirect('/')
})

//TODO check usage for this
// Monitor modems
app.get('/monitor-modems', async (c) => {
  try {
    // Execute mmcli -M in the background
    execa('mmcli', ['-M'])
  } catch (error) {
    console.error('Error monitoring modems:', error)
  }
  return c.redirect('/')
})

app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})

serve({
  fetch: app.fetch,
  port: Number(process.env.WEB_PORT || 3000),
})

console.info(`Web server running on port ${process.env.WEB_PORT || 3000}`)