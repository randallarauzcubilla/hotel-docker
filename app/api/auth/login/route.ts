import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Buscar usuario con su rol
    const result = await pool.query(`
      SELECT u.*, r.nombre as rol
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.email = $1 AND u.activo = true
    `, [email])

    const usuario = result.rows[0]

    if (!usuario) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password)

    if (!passwordValido) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    // Generar JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    )

    return NextResponse.json({
      token,
      rol: usuario.rol,
      nombre: usuario.nombre
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}