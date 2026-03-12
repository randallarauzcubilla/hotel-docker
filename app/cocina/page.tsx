'use client'
import { useState, useEffect } from 'react'

type Adicional = { nombre: string; precio: string }
type Item = { id: number; cantidad: number; precio_unitario: string; producto: { id: number; nombre: string }; adicionales: Adicional[] | null }
type Pedido = { id: number; mesa: string; estado: string; total: string; created_at: string; items: Item[] }

export default function CocinaPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cargando, setCargando] = useState(true)

  const cargarPedidos = async () => {
    const res = await fetch('/api/pedidos')
    const data = await res.json()
    setPedidos(data.filter((p: Pedido) => p.estado === 'pagado'))
    setCargando(false)
  }

    useEffect(() => {
    const token = localStorage.getItem('token')
    const rol = localStorage.getItem('rol')
    if (!token) { window.location.href = '/login'; return }
    if (rol !== 'cocina') { window.location.href = '/login'; return } // cambiar a 'cocina' en cocina
    cargarPedidos()
    const intervalo = setInterval(cargarPedidos, 5000)
    return () => clearInterval(intervalo)
  }, [])

  const marcarListo = async (id: number) => {
    await fetch(`/api/pedidos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'listo' })
    })
    cargarPedidos()
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
        <h1 className="text-xl font-bold text-orange-500">👨‍🍳 Cocina</h1>
        <button onClick={cargarPedidos} className="text-slate-400 text-sm hover:text-white">
          🔄 Actualizar
        </button>
      </div>

      {cargando ? (
        <div className="flex justify-center items-center h-64 text-slate-400">Cargando...</div>
      ) : pedidos.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-slate-400">Sin pedidos para preparar</div>
      ) : (
        <div className="p-4 grid gap-3">
          {pedidos.map(pedido => (
            <div key={pedido.id} className="bg-slate-800 rounded-2xl p-4 border border-orange-500">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-xl">Mesa {pedido.mesa}</span>
                <span className="text-xs text-slate-400">
                  {new Date(pedido.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {pedido.items?.map((item, i) => (
                <div key={i} className="mb-3 bg-slate-700 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">
                      {item.cantidad}
                    </span>
                    <span className="font-medium">{item.producto.nombre}</span>
                  </div>
                  {item.adicionales && item.adicionales.length > 0 && (
                    <div className="text-xs text-orange-300 mt-1 ml-9">
                      + {item.adicionales.map(a => a.nombre).join(', ')}
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={() => marcarListo(pedido.id)}
                className="w-full mt-2 bg-green-500 py-3 rounded-xl font-bold hover:bg-green-400 transition-all"
              >
                ✅ LISTO
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}