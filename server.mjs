import { createServer } from 'https'
import { readFileSync } from 'fs'
import next from 'next'

const app = next({ dev: true })
const handle = app.getRequestHandler()

const httpsOptions = {
  key: readFileSync('./localhost+1-key.pem'),
  cert: readFileSync('./localhost+1.pem'),
}

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    handle(req, res)
  }).listen(3000, () => {
    console.log('✅ Server corriendo en https://localhost:3000')
    console.log('✅ Red: https://192.168.100.9:3000')
  })
})