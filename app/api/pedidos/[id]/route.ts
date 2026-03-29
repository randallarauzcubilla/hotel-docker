declare global {
  // eslint-disable-next-line no-var
  var io: import('socket.io').Server | undefined
}
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { estado } = await req.json()
    await pool.query(`UPDATE pedidos SET estado = ? WHERE id = ?`, [estado, id])

    // Avisar a todos los clientes ✅
    if (global.io) {
      global.io.emit('actualizar_pedidos')
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}