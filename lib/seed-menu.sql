-- CATEGORÍAS
INSERT INTO categorias (nombre, tiene_adicionales, orden) VALUES
  ('Desayuno', true, 1),
  ('Almuerzo', true, 2),
  ('Arroces', true, 3),
  ('Ensaladas', false, 4),
  ('Pastas', true, 5),
  ('Sopas y Mariscos', true, 6),
  ('Carne Roja y Blanca', true, 7),
  ('Comidas Rápidas', false, 8),
  ('Bebidas', false, 9),
  ('Postres', false, 10);

-- DESAYUNOS
INSERT INTO productos (nombre, precio, categoria_id) VALUES
('Pinto con Huevos al Gusto', 3000, 1),
('Pinto con Salchichón/Natilla/Queso', 3000, 1),
('Pinto con Carne/Pollo/Carne Mexicana', 3500, 1),
('Pinto con Chuleta o Bisteck', 4000, 1),
('Huevos Rancheros', 3000, 1),
('Huevos Rancheros Especial', 3500, 1),
('Omeleth Tradicional', 3000, 1),
('Omeleth de la Casa', 3500, 1),
('Panqueques con Miel de Maple', 1500, 1),
('Tortilla Palmeada', 1000, 1),
('Tortilla Alineada', 1500, 1),
('Empanadas de Queso/Carne/Pollo/Frijoles', 1500, 1),
('Empanadas Arregladas', 2000, 1),
('Gallitos de Queso/Carne/Pollo/Salchichón', 2300, 1),
('Gallitos Arreglados', 2800, 1),
('Emparedado/Sandwich', 2500, 1),
('Tostadas con Mermelada', 800, 1),
('Prensada', 800, 1);

-- ALMUERZOS
INSERT INTO productos (nombre, precio, categoria_id) VALUES
('Casado con Carne/Pollo/Carne Mexicana/Lengua/Pescado', 3500, 2),
('Casado con Bisteck/Chuleta/Filete de Pollo', 4000, 2),
('Casado Especial', 4500, 2),
('Arroz Blanco y Carne en Salsa', 2000, 2);

-- ARROCES
INSERT INTO productos (nombre, precio, categoria_id) VALUES
('Arroz con Pollo', 4800, 3),
('Arroz con Res', 4800, 3),
('Arroz con Cerdo', 5000, 3),
('Arroz con Atún', 4000, 3),
('Arroz con Calamares', 5000, 3),
('Arroz con Camarones', 6000, 3),
('Arroz con Mariscos', 7000, 3),
('Arroz de la Casa', 6500, 3);

-- ENSALADAS
INSERT INTO productos (nombre, precio, categoria_id) VALUES
('Ensalada Verde', 3000, 4),
('Ensalada Verde con Atún', 3000, 4),
('Ensalada Verde con Pollo', 3800, 4),
('Ensalada Verde con Jamón y Queso', 3500, 4);

-- PASTAS
INSERT INTO productos (nombre, precio, categoria_id) VALUES
('Espaguetis Salsa Blanca con Hongos', 5000, 5),
('Espaguetis Salsa Blanca con Pollo', 6000, 5),
('Espaguetis Salsa Blanca con Hongos y Camarones', 7000, 5),
('Espaguetis Salsa Boloñesa', 6000, 5),
('Espaguetis Salsa de Tomate con Atún', 4500, 5);

-- SOPAS Y MARISCOS
INSERT INTO productos (nombre, precio, categoria_id) VALUES
('Sopa de Mariscos', 5800, 6),
('Sopa Azteca', 5000, 6),
('Sopa Negra', 3500, 6),
('Consomé de Pollo con Verduritas', 3500, 6),
('Consomé de Res con Verduritas', 3500, 6),
('Filete de Pescado Empanizado/Al Ajillo', 6000, 6),
('Filete de Pescado Salsa Blanca/Tomate', 7000, 6),
('Camarones En Salsa Blanca/Empanizados/Al Ajillo', 7000, 6);

-- CARNES
INSERT INTO productos (nombre, precio, categoria_id) VALUES
('Gordon Blue de Pollo', 6000, 7),
('Filete de Pollo en Salsa Blanca', 6000, 7),
('Pechuga a la Plancha', 5000, 7),
('Pechuga Empanizada', 5000, 7),
('Gordon Blue de Lomo', 6000, 7),
('Lomo a la Plancha', 6000, 7),
('Bisteck Encebollado', 6000, 7),
('Bisteck en Salsa de Tomate', 6800, 7),
('Chuleta Encebollada', 6000, 7),
('Chuleta en Salsa de Tomate', 6800, 7),
('Lengua en Salsa', 6000, 7),
('Costillas de Cerdo en Salsa BBQ', 6000, 7),
('Gordon Blue de Camarón', 7000, 7);

-- COMIDAS RÁPIDAS
INSERT INTO productos (nombre, precio, categoria_id) VALUES
('Hamburguesa + Papas', 3500, 8),
('Salchipapas', 3000, 8),
('Taco de Pollo o Res', 2500, 8),
('Nachos de Pollo o Carne', 5000, 8),
('Papas Supremas de Pollo o Carne', 5000, 8),
('Patacones con Mexicana o Frijoles Molidos', 3000, 8),
('Orden de Papas o Patacones', 2000, 8),
('Deditos de Pollo o Pescado', 4800, 8),
('Fajitas de Pollo o Res', 4800, 8),
('Quesadilla de Pollo o Carne Mechada', 5000, 8),
('Chalupa de Pollo o Carne Mechada', 3000, 8);

-- BEBIDAS
INSERT INTO productos (nombre, precio, categoria_id) VALUES
('Café Negro o con Leche', 800, 9),
('Chocolate', 800, 9),
('Té Negro o de Manzanilla', 800, 9),
('Agua Dulce', 800, 9),
('Jugo de Naranja', 800, 9),
('Naturales', 800, 9),
('Batidos en Agua o Leche', 2000, 9),
('Gaseosas en Lata', 800, 9),
('Gaseosas 600ml', 1000, 9),
('Tropicales en Vidrio', 1000, 9),
('Tropicales Desechable', 1200, 9),
('Cerveza Nacional', 1500, 9);

-- POSTRES
INSERT INTO productos (nombre, precio, categoria_id) VALUES
('Copa de Helado', 1000, 10),
('Helado con Gelatina', 1500, 10),
('Ensalada de Coctel de Frutas', 2000, 10);

-- ADICIONALES DESAYUNO
INSERT INTO adicionales (nombre, precio) VALUES
('Salchichón', 600),
('Natilla', 600),
('Queso', 600),
('Ord. de Huevos', 600),
('Carne en Salsa', 1500),
('Pollo en Salsa', 1500),
('Carne Mexicana', 1500),
('Bisteck', 1500),
('Chuleta', 1500),
('Ord. de Pinto', 1000),
('Ord. de Pan', 600),
('Ord. de Maduros', 1000);

-- ADICIONALES ALMUERZO
INSERT INTO adicionales (nombre, precio) VALUES
('Ord. Carne en Salsa', 1500),
('Ord. Pollo en Salsa', 1500),
('Ord. Carne Mexicana', 1500),
('Filete de Pescado', 2000),
('Filete de Pollo', 2000),
('Ord. Costillas', 2000),
('Lengua en Salsa', 2000),
('Ord. de Frijoles', 800),
('Ord. Ensalada Fría o Picadillo', 800),
('Ord. de Arroz', 800),
('Ord. de Maduros Almuerzo', 1000);

-- ADICIONALES PASTAS
INSERT INTO adicionales (nombre, precio) VALUES
('Extra de Hongos', 800),
('Ord. de Pan Pasta', 800),
('Extra de Queso', 800);

-- ADICIONALES SOPAS
INSERT INTO adicionales (nombre, precio) VALUES
('Ord. de Arroz Blanco', 800);

-- VINCULAR ADICIONALES A CATEGORÍAS
INSERT INTO categoria_adicionales (categoria_id, adicional_id)
SELECT 1, id FROM adicionales 
WHERE nombre IN ('Salchichón','Natilla','Queso','Ord. de Huevos','Carne en Salsa','Pollo en Salsa','Carne Mexicana','Bisteck','Chuleta','Ord. de Pinto','Ord. de Pan','Ord. de Maduros');

INSERT INTO categoria_adicionales (categoria_id, adicional_id)
SELECT 2, id FROM adicionales 
WHERE nombre IN ('Ord. Carne en Salsa','Ord. Pollo en Salsa','Ord. Carne Mexicana','Filete de Pescado','Filete de Pollo','Ord. Costillas','Lengua en Salsa','Ord. de Frijoles','Ord. Ensalada Fría o Picadillo','Ord. de Arroz','Ord. de Maduros Almuerzo');

INSERT INTO categoria_adicionales (categoria_id, adicional_id)
SELECT 5, id FROM adicionales 
WHERE nombre IN ('Extra de Hongos','Ord. de Pan Pasta','Extra de Queso');

INSERT INTO categoria_adicionales (categoria_id, adicional_id)
SELECT 6, id FROM adicionales 
WHERE nombre IN ('Ord. de Arroz Blanco');