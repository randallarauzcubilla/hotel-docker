'use client'
import { useState, useEffect } from 'react'

type Adicional = { id: number; nombre: string; precio: string }
type Producto = { id: number; nombre: string; precio: string; categoria_id: number }
type Categoria = { id: number; nombre: string; tiene_adicionales: boolean; productos: Producto[]; adicionales: Adicional[] }
type ItemCarrito = { producto: Producto; cantidad: number; adicionales: Adicional[] }

export default function MenuPage() {
  const [menu, setMenu] = useState<Categoria[]>([])
  const [tabActiva, setTabActiva] = useState(0)
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [modalProducto, setModalProducto] = useState<Producto | null>(null)
  const [adicionalesSeleccionados, setAdicionalesSeleccionados] = useState<Adicional[]>([])
  const [mesa, setMesa] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [carritoAbierto, setCarritoAbierto] = useState(false)

  useEffect(() => {
  const token = localStorage.getItem('token')
  if (!token) { window.location.href = '/login'; return }
  fetch('/api/menu').then(r => r.json()).then(setMenu)
}, [])

  const categoriaActiva = menu[tabActiva]

  const abrirModal = (producto: Producto) => {
    setModalProducto(producto)
    setAdicionalesSeleccionados([])
  }

  const toggleAdicional = (adicional: Adicional) => {
    setAdicionalesSeleccionados(prev =>
      prev.find(a => a.id === adicional.id)
        ? prev.filter(a => a.id !== adicional.id)
        : [...prev, adicional]
    )
  }

  const agregarAlCarrito = () => {
    if (!modalProducto) return
    setCarrito(prev => {
      const existente = prev.findIndex(
        item => item.producto.id === modalProducto.id &&
        JSON.stringify(item.adicionales.map(a => a.id).sort()) ===
        JSON.stringify(adicionalesSeleccionados.map(a => a.id).sort())
      )
      if (existente >= 0) {
        const nuevo = [...prev]
        nuevo[existente] = { ...nuevo[existente], cantidad: nuevo[existente].cantidad + 1 }
        return nuevo
      }
      return [...prev, { producto: modalProducto, cantidad: 1, adicionales: adicionalesSeleccionados }]
    })
    setModalProducto(null)
  }

  const cambiarCantidad = (index: number, delta: number) => {
    setCarrito(prev => {
      const nuevo = prev.map((item, i) =>
        i === index ? { ...item, cantidad: item.cantidad + delta } : item
      ).filter(item => item.cantidad > 0)
      return nuevo
    })
  }

  const totalCarrito = carrito.reduce((acc, item) => {
    const precioAdicionales = item.adicionales.reduce((a, ad) => a + Number(ad.precio), 0)
    return acc + (Number(item.producto.precio) + precioAdicionales) * item.cantidad
  }, 0)

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0)

  const enviarPedido = async () => {
    if (!mesa || carrito.length === 0) return
    setEnviando(true)
    const res = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mesa, items: carrito, total: totalCarrito })
    })
    if (res.ok) {
      setCarrito([])
      setMesa('')
      setCarritoAbierto(false)
    }
    setEnviando(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700">
        <h1 className="text-xl font-bold text-orange-500">🍽️ Tomar Pedido</h1>
        <input
          placeholder="Mesa #"
          value={mesa}
          onChange={e => setMesa(e.target.value)}
          className="bg-slate-700 rounded-xl px-4 py-2 text-sm outline-none w-28 text-center"
        />
      </div>

      {/* Tabs categorías */}
      <div className="flex overflow-x-auto gap-2 p-3 bg-slate-800 border-b border-slate-700">
        {menu.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => setTabActiva(i)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition-all ${
              tabActiva === i ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {/* Productos */}
      <div className="p-3 grid grid-cols-1 gap-2 pb-24">
        {categoriaActiva?.productos.map(producto => (
          <button
            key={producto.id}
            onClick={() => abrirModal(producto)}
            className="bg-slate-800 rounded-2xl p-4 flex justify-between items-center hover:bg-slate-700 transition-all text-left border border-slate-700"
          >
            <span className="text-sm font-medium">{producto.nombre}</span>
            <span className="text-orange-400 font-bold text-sm ml-2 whitespace-nowrap">
              ₡{Number(producto.precio).toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {/* Barra flotante carrito */}
      {carrito.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          {/* Carrito expandido */}
          {carritoAbierto && (
            <div className="bg-slate-800 border-t border-slate-700 p-4 max-h-80 overflow-y-auto">
              {carrito.map((item, i) => (
                <div key={i} className="flex items-center justify-between mb-3 text-sm">
                  <div className="flex-1">
                    <span>{item.producto.nombre}</span>
                    {item.adicionales.length > 0 && (
                      <div className="text-xs text-slate-400">
                        + {item.adicionales.map(a => a.nombre).join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => cambiarCantidad(i, -1)}
                      className="bg-slate-600 w-7 h-7 rounded-full font-bold hover:bg-red-500 transition-all"
                    >-</button>
                    <span className="w-5 text-center font-bold">{item.cantidad}</span>
                    <button
                      onClick={() => cambiarCantidad(i, 1)}
                      className="bg-slate-600 w-7 h-7 rounded-full font-bold hover:bg-green-500 transition-all"
                    >+</button>
                  </div>
                  <span className="text-orange-400 ml-3 whitespace-nowrap text-xs">
                    ₡{((Number(item.producto.precio) + item.adicionales.reduce((a, ad) => a + Number(ad.precio), 0)) * item.cantidad).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Barra inferior */}
          <div
            className="bg-orange-500 p-4 flex justify-between items-center cursor-pointer"
            onClick={() => setCarritoAbierto(!carritoAbierto)}
          >
            <div className="flex items-center gap-3">
              <span className="bg-white text-orange-500 rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">
                {totalItems}
              </span>
              <span className="font-bold">{carritoAbierto ? '▼ Cerrar pedido' : '▲ Ver pedido'}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold">₡{totalCarrito.toLocaleString()}</span>
              {carritoAbierto && (
                <button
                  onClick={e => { e.stopPropagation(); enviarPedido() }}
                  disabled={enviando || !mesa}
                  className="bg-white text-orange-500 px-4 py-1 rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  {enviando ? '...' : 'ENVIAR'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal adicionales */}
      {modalProducto && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50">
          <div className="bg-slate-800 rounded-t-3xl p-6 w-full max-w-lg">
            <h3 className="font-bold text-lg mb-1">{modalProducto.nombre}</h3>
            <p className="text-orange-400 mb-4">₡{Number(modalProducto.precio).toLocaleString()}</p>

            {categoriaActiva?.tiene_adicionales && categoriaActiva.adicionales.length > 0 && (
              <>
                <p className="text-sm text-slate-400 mb-2">Adicionales:</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {categoriaActiva.adicionales.map(ad => (
                    <button
                      key={ad.id}
                      onClick={() => toggleAdicional(ad)}
                      className={`p-2 rounded-xl text-xs text-left transition-all border ${
                        adicionalesSeleccionados.find(a => a.id === ad.id)
                          ? 'bg-orange-500 border-orange-500'
                          : 'bg-slate-700 border-slate-600'
                      }`}
                    >
                      {ad.nombre}
                      <span className="block text-orange-200">+₡{Number(ad.precio).toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setModalProducto(null)}
                className="flex-1 bg-slate-700 py-3 rounded-xl font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={agregarAlCarrito}
                className="flex-1 bg-orange-500 py-3 rounded-xl font-bold hover:bg-orange-400"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}