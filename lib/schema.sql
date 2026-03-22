-- ROLES
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

INSERT IGNORE INTO roles (nombre) VALUES
  ('mesero'), ('cocina'), ('caja'), ('admin');

-- USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(100),
  rol_id INT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- CATEGORIAS
CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  tiene_adicionales BOOLEAN DEFAULT false,
  orden INT DEFAULT 0
);

-- PRODUCTOS
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  categoria_id INT,
  activo BOOLEAN DEFAULT true,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- ADICIONALES
CREATE TABLE IF NOT EXISTS adicionales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  activo BOOLEAN DEFAULT true
);

-- CATEGORIA ADICIONALES
CREATE TABLE IF NOT EXISTS categoria_adicionales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoria_id INT,
  adicional_id INT,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  FOREIGN KEY (adicional_id) REFERENCES adicionales(id)
);

-- PEDIDOS
CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mesa VARCHAR(50),
  estado VARCHAR(50) DEFAULT 'pendiente_pago',
  total DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PEDIDO ITEMS
CREATE TABLE IF NOT EXISTS pedido_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT,
  producto_id INT,
  cantidad INT DEFAULT 1,
  precio_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- PEDIDO ITEM ADICIONALES
CREATE TABLE IF NOT EXISTS pedido_item_adicionales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_item_id INT,
  adicional_id INT,
  cantidad INT DEFAULT 1,
  precio_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (pedido_item_id) REFERENCES pedido_items(id),
  FOREIGN KEY (adicional_id) REFERENCES adicionales(id)
);