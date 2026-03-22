import 'dotenv/config'
import pool from './db'
import bcrypt from 'bcryptjs'

async function seed() {
  const password = await bcrypt.hash('Admin2026!', 10)

  await pool.query(`
    INSERT IGNORE INTO usuarios (email, password, nombre, rol_id)
    VALUES
      ('admin@hotel.com', ?, 'Administrador', 4),
      ('caja@hotel.com', ?, 'Cajero', 3),
      ('cocina@hotel.com', ?, 'Cocina', 2),
      ('mesero@hotel.com', ?, 'Mesero', 1)
  `, [password, password, password, password])

  console.log('✅ Usuarios creados!')
  process.exit(0)
}

seed()