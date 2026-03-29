import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import mysql from 'mysql2/promise'

declare global {
  // eslint-disable-next-line no-var
  var io: import('socket.io').Server | undefined
}

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.id, p.mesa, p.estado, p.total,
        p.created_at,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', pi.id,
            'cantidad', pi.cantidad,
            'precio_unitario', pi.precio_unitario,
            'producto', JSON_OBJECT('id', pr.id, 'nombre', pr.nombre),
            'adicionales', (
              SELECT JSON_ARRAYAGG(JSON_OBJECT('nombre', a.nombre, 'precio', pia.precio_unitario))
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
      ORDER BY p.created_at ASC
    `)
    return NextResponse.json(rows)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { mesa, items, total } = await req.json()

    const [pedido] = await pool.query(
      `INSERT INTO pedidos (mesa, total) VALUES (?, ?)`,
      [mesa, total]
    ) as [mysql.ResultSetHeader, mysql.FieldPacket[]]

    const pedidoId = pedido.insertId

    for (const item of items) {
      const [pedidoItem] = await pool.query(
        `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
        VALUES (?, ?, ?, ?)`,
        [pedidoId, item.producto.id, item.cantidad, item.producto.precio]
      ) as [mysql.ResultSetHeader, mysql.FieldPacket[]]

      const itemId = pedidoItem.insertId

      for (const adicional of item.adicionales) {
        await pool.query(
          `INSERT INTO pedido_item_adicionales (pedido_item_id, adicional_id, precio_unitario)
           VALUES (?, ?, ?)`,
          [itemId, adicional.id, adicional.precio]
        )
      }
    }

    // Avisar a caja que llegó pedido nuevo ✅
    if (global.io) {
      global.io.emit('actualizar_pedidos')
    }

    return NextResponse.json({ id: pedidoId })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}