-- Ejecutar este archivo si ya tenías la base creada y no te deja iniciar sesión.
-- No borra tablas. Solo corrige roles, usuarios iniciales y contraseñas.
-- Contraseña temporal inicial para las 4 cuentas: 123456

INSERT INTO roles (id, nombre) VALUES
(1, 'ADMINISTRADOR'),
(2, 'OPERADOR'),
(3, 'PRODUCTOR'),
(4, 'COMPRADOR')
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre;

INSERT INTO usuarios (nombre, telefono, ubicacion, username, password, rol_id, estado, reputacion)
VALUES
('Admin Asociación', '50000001', 'La Esperanza', 'admin', '$2b$10$oQzyxJiAilMs/pte32sHKeUTOSQGsbo41ssSUT/2diNCFeTdCMzJm', 1, true, 5.0),
('Productor La Esperanza', '50000002', 'La Esperanza', 'productor', '$2b$10$oQzyxJiAilMs/pte32sHKeUTOSQGsbo41ssSUT/2diNCFeTdCMzJm', 3, true, 5.0),
('Comprador Terminal Central', '50000003', 'Terminal Central', 'comprador', '$2b$10$oQzyxJiAilMs/pte32sHKeUTOSQGsbo41ssSUT/2diNCFeTdCMzJm', 4, true, 5.0),
('Operador Asociación', '50000004', 'La Esperanza', 'operador', '$2b$10$oQzyxJiAilMs/pte32sHKeUTOSQGsbo41ssSUT/2diNCFeTdCMzJm', 2, true, 5.0)
ON CONFLICT (username) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  telefono = EXCLUDED.telefono,
  ubicacion = EXCLUDED.ubicacion,
  password = EXCLUDED.password,
  rol_id = EXCLUDED.rol_id,
  estado = true;
