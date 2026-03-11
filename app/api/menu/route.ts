import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    // Categorías
    const cats = await pool.query(`
      SELECT * FROM categorias ORDER BY orden
    `)

    // Productos
    const prods = await pool.query(`
      SELECT * FROM productos WHERE activo = true
    `)

    // Adicionales por categoría
    const adics = await pool.query(`
      SELECT ca.categoria_id, a.id, a.nombre, a.precio
      FROM categoria_adicionales ca
      JOIN adicionales a ON ca.adicional_id = a.id
      WHERE a.activo = true
    `)

    // Armar estructura
    const menu = cats.rows.map(cat => ({
      ...cat,
      productos: prods.rows.filter(p => p.categoria_id === cat.id),
      adicionales: adics.rows.filter(a => a.categoria_id === cat.id)
    })).filter(cat => cat.productos.length > 0)

    return NextResponse.json(menu)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}