import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const pedidos = await pool.query(`
      SELECT
        p.id, p.mesa, p.estado, p.total, p.created_at,
        json_agg(
          json_build_object(
            'id', pi.id,
            'cantidad', pi.cantidad,
            'precio_unitario', pi.precio_unitario,
            'producto', json_build_object('id', pr.id, 'nombre', pr.nombre),
            'adicionales', (
              SELECT json_agg(json_build_object('nombre', a.nombre, 'precio', pia.precio_unitario))
              FROM pedido_item_adicionales pia
              JOIN adicionales a ON pia.adicional_id = a.id
              WHERE pia.pedido_item_id = pi.id
            )
          )
        ) as items
      FROM pedidos p
      JOIN pedido_items pi ON pi.pedido_id = p.id
      JOIN productos pr ON pi.producto_id = pr.id
      WHERE p.estado != 'listo'
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `)
    return NextResponse.json(pedidos.rows)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { mesa, items, total } = await req.json()

    const pedido = await pool.query(
      `INSERT INTO pedidos (mesa, total) VALUES ($1, $2) RETURNING id`,
      [mesa, total]
    )
    const pedidoId = pedido.rows[0].id

    for (const item of items) {
      const pedidoItem = await pool.query(
        `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [pedidoId, item.producto.id, item.cantidad, item.producto.precio]
      )
      const itemId = pedidoItem.rows[0].id

      for (const adicional of item.adicionales) {
        await pool.query(
          `INSERT INTO pedido_item_adicionales (pedido_item_id, adicional_id, precio_unitario)
           VALUES ($1, $2, $3)`,
          [itemId, adicional.id, adicional.precio]
        )
      }
    }

    return NextResponse.json({ id: pedidoId })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}