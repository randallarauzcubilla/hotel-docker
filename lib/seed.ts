import 'dotenv/config'
import pool from './db'
import bcrypt from 'bcryptjs'

async function seed() {
  const password = await bcrypt.hash('Admin2026!', 10)

  await pool.query(`
    INSERT INTO usuarios (email, password, nombre, rol_id)
    VALUES
      ('admin@hotel.com', $1, 'Administrador', 4),
      ('caja@hotel.com', $1, 'Cajero', 3),
      ('cocina@hotel.com', $1, 'Cocina', 2),
      ('mesero@hotel.com', $1, 'Mesero', 1)
    ON CONFLICT DO NOTHING
  `, [password])

  console.log('✅ Usuarios creados!')
  process.exit(0)
}

seed()