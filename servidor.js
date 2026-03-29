import { createServer } from 'http'
import { Server } from 'socket.io'
import next from 'next'

const app = next({ dev: true })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res)
  })

  const io = new Server(httpServer, {
    cors: { origin: '*' }
  })

  // Guardar io globalmente para usarlo en las APIs
  global.io = io

  io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('Cliente desconectado ✅')
  })
  socket.on('pedido_nuevo', () => {
    io.emit('actualizar_pedidos')
  })
})

  httpServer.listen(3000, () => {
    console.log('✅ Server en http://localhost:3000')
    console.log('✅ Red: http://192.168.100.9:3000')
  })
})