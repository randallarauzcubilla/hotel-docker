-- ROLES
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL
);

INSERT INTO roles (nombre) VALUES
  ('mesero'), ('cocina'), ('caja'), ('admin')
ON CONFLICT DO NOTHING;

-- USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nombre TEXT,
  rol_id INT REFERENCES roles(id),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- CATEGORIAS
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  tiene_adicionales BOOLEAN DEFAULT false,
  orden INT DEFAULT 0
);

-- PRODUCTOS
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio NUMERIC NOT NULL,
  categoria_id INT REFERENCES categorias(id),
  activo BOOLEAN DEFAULT true
);

-- ADICIONALES
CREATE TABLE IF NOT EXISTS adicionales (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio NUMERIC NOT NULL,
  activo BOOLEAN DEFAULT true
);

-- CATEGORIA ADICIONALES
CREATE TABLE IF NOT EXISTS categoria_adicionales (
  id SERIAL PRIMARY KEY,
  categoria_id INT REFERENCES categorias(id),
  adicional_id INT REFERENCES adicionales(id)
);

-- PEDIDOS
CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  mesa TEXT,
  estado TEXT DEFAULT 'pendiente_pago',
  total NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PEDIDO ITEMS
CREATE TABLE IF NOT EXISTS pedido_items (
  id SERIAL PRIMARY KEY,
  pedido_id INT REFERENCES pedidos(id),
  producto_id INT REFERENCES productos(id),
  cantidad INT DEFAULT 1,
  precio_unitario NUMERIC NOT NULL
);

-- PEDIDO ITEM ADICIONALES
CREATE TABLE IF NOT EXISTS pedido_item_adicionales (
  id SERIAL PRIMARY KEY,
  pedido_item_id INT REFERENCES pedido_items(id),
  adicional_id INT REFERENCES adicionales(id),
  cantidad INT DEFAULT 1,
  precio_unitario NUMERIC NOT NULL
);