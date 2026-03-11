import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { estado } = await req.json()
    await pool.query(`UPDATE pedidos SET estado = $1 WHERE id = $2`, [estado, id])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}