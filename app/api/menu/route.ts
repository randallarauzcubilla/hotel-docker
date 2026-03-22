import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const [cats] = await pool.query(`SELECT * FROM categorias ORDER BY orden`)
    const [prods] = await pool.query(`SELECT * FROM productos WHERE activo = true`)
    const [adics] = await pool.query(`
      SELECT ca.categoria_id, a.id, a.nombre, a.precio
      FROM categoria_adicionales ca
      JOIN adicionales a ON ca.adicional_id = a.id
      WHERE a.activo = true
    `)

    const categorias = cats as Record<string, unknown>[]
    const productos = prods as Record<string, unknown>[]
    const adicionales = adics as Record<string, unknown>[]

    const menu = categorias.map(cat => ({
      ...cat,
      productos: productos.filter(p => p.categoria_id === cat.id),
      adicionales: adicionales.filter(a => a.categoria_id === cat.id)
    })).filter(cat => cat.productos.length > 0)

    return NextResponse.json(menu)

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}