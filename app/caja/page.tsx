'use client'
import { useState, useEffect } from 'react'

type Adicional = { nombre: string; precio: string }
type Item = { id: number; cantidad: number; precio_unitario: string; producto: { id: number; nombre: string }; adicionales: Adicional[] | null }
type Pedido = { id: number; mesa: string; estado: string; total: string; created_at: string; items: Item[] }

export default function CajaPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [pedidoAbierto, setPedidoAbierto] = useState<number | null>(null)
  const [cargando, setCargando] = useState(true)

  const cargarPedidos = async () => {
    const res = await fetch('/api/pedidos')
    const data = await res.json()
    setPedidos(data.filter((p: Pedido) => p.estado === 'pendiente_pago'))
    setCargando(false)
  }

    useEffect(() => {
    const token = localStorage.getItem('token')
    const rol = localStorage.getItem('rol')
    if (!token) { window.location.href = '/login'; return }
    if (rol !== 'caja') { window.location.href = '/login'; return } // cambiar a 'cocina' en cocina
    cargarPedidos()
    const intervalo = setInterval(cargarPedidos, 5000)
    return () => clearInterval(intervalo)
  }, [])

  const cobrar = async (id: number) => {
    await fetch(`/api/pedidos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'pagado' })
    })
    cargarPedidos()
    setPedidoAbierto(null)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
        <h1 className="text-xl font-bold text-orange-500">💰 Caja</h1>
        <button onClick={cargarPedidos} className="text-slate-400 text-sm hover:text-white">
          🔄 Actualizar
        </button>
      </div>

      {cargando ? (
        <div className="flex justify-center items-center h-64 text-slate-400">Cargando...</div>
      ) : pedidos.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-slate-400">Sin pedidos pendientes</div>
      ) : (
        <div className="p-4 grid gap-3">
          {pedidos.map(pedido => (
            <div
              key={pedido.id}
              onClick={() => setPedidoAbierto(pedidoAbierto === pedido.id ? null : pedido.id)}
              className="bg-slate-800 rounded-2xl p-4 border border-slate-700 cursor-pointer hover:border-orange-500 transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-lg">Mesa {pedido.mesa}</span>
                  <span className={`ml-3 text-xs px-2 py-1 rounded-full ${
                    pedido.estado === 'pendiente_pago' ? 'bg-yellow-500/20 text-yellow-400' :
                    pedido.estado === 'pagado' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {pedido.estado.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-orange-400 font-bold text-lg">
                  ₡{Number(pedido.total).toLocaleString()}
                </span>
              </div>

             <div className="text-xs text-slate-400 mt-1">
              {new Date(pedido.created_at + 'Z').toLocaleTimeString('es-CR', { timeZone: 'America/Costa_Rica' })} · {pedido.items?.length} productos
            </div>

              {/* Detalle expandido */}
              {pedidoAbierto === pedido.id && (
                <div className="mt-4 border-t border-slate-700 pt-4">
                  {pedido.items?.map((item, i) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between text-sm">
                        <span>x{item.cantidad} {item.producto.nombre}</span>
                        <span className="text-orange-400">₡{(Number(item.precio_unitario) * item.cantidad).toLocaleString()}</span>
                      </div>
                      {item.adicionales && item.adicionales.length > 0 && (
                        <div className="text-xs text-slate-400 ml-3">
                          + {item.adicionales.map(a => a.nombre).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={e => { e.stopPropagation(); cobrar(pedido.id) }}
                    className="w-full mt-4 bg-green-500 py-3 rounded-xl font-bold hover:bg-green-400 transition-all"
                  >
                    ✅ COBRAR ₡{Number(pedido.total).toLocaleString()}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}