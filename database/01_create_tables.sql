-- Script completo de instalación/reinicio de base de datos.
-- ADVERTENCIA: elimina las tablas del sistema si ya existen para dejar una instalación limpia.

DROP TABLE IF EXISTS bitacora CASCADE;
DROP TABLE IF EXISTS incumplimientos CASCADE;
DROP TABLE IF EXISTS entregas CASCADE;
DROP TABLE IF EXISTS puntos_entrega CASCADE;
DROP TABLE IF EXISTS solicitudes_compra CASCADE;
DROP TABLE IF EXISTS publicaciones CASCADE;
DROP TABLE IF EXISTS unidades_medida CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- =========================================
-- BASE DE DATOS
-- Sistema La Esperanza
-- ============================================

-- =========================
-- TABLA ROLESss
-- =========================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- =========================
-- TABLA USUARIOS
-- =========================

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) UNIQUE NOT NULL,
    ubicacion VARCHAR(150),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol_id INTEGER REFERENCES roles(id),
    estado BOOLEAN DEFAULT TRUE,
    reputacion NUMERIC(2,1) DEFAULT 5.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA PRODUCTOS
-- =========================

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    categoria VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE
);

-- =========================
-- TABLA UNIDADES DE MEDIDA
-- =========================

CREATE TABLE unidades_medida (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- =========================
-- TABLA PUBLICACIONES
-- =========================

CREATE TABLE publicaciones (
    id SERIAL PRIMARY KEY,
    productor_id INTEGER REFERENCES usuarios(id),
    producto_id INTEGER REFERENCES productos(id),
    unidad_id INTEGER REFERENCES unidades_medida(id),

    cantidad NUMERIC(10,2) NOT NULL,
    precio_referencial NUMERIC(10,2) NOT NULL,

    descripcion TEXT,

    estado VARCHAR(50) DEFAULT 'DISPONIBLE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA SOLICITUDES
-- =========================

CREATE TABLE solicitudes_compra (
    id SERIAL PRIMARY KEY,

    publicacion_id INTEGER REFERENCES publicaciones(id),

    comprador_id INTEGER REFERENCES usuarios(id),

    cantidad_solicitada NUMERIC(10,2) NOT NULL,

    precio_final NUMERIC(10,2),

    estado VARCHAR(50) DEFAULT 'PENDIENTE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA PUNTOS ENTREGA
-- =========================

CREATE TABLE puntos_entrega (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- =========================
-- TABLA ENTREGAS
-- =========================

CREATE TABLE entregas (
    id SERIAL PRIMARY KEY,

    solicitud_id INTEGER REFERENCES solicitudes_compra(id),

    punto_entrega_id INTEGER REFERENCES puntos_entrega(id),

    fecha_entrega DATE,
    hora_entrega TIME,

    cantidad_entregada NUMERIC(10,2),

    estado VARCHAR(50) DEFAULT 'PROGRAMADA',

    confirmacion_productor BOOLEAN DEFAULT FALSE,
    validacion_comprador BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA INCUMPLIMIENTOS
-- =========================

CREATE TABLE incumplimientos (
    id SERIAL PRIMARY KEY,

    entrega_id INTEGER REFERENCES entregas(id),

    reportado_por INTEGER REFERENCES usuarios(id),

    descripcion TEXT NOT NULL,

    estado VARCHAR(50) DEFAULT 'PENDIENTE',

    aprobado BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA BITACORA
-- =========================

CREATE TABLE bitacora (
    id SERIAL PRIMARY KEY,

    usuario_id INTEGER REFERENCES usuarios(id),

    accion VARCHAR(255),

    descripcion TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- INSERTAR ROLES
-- =========================

INSERT INTO roles (nombre)
VALUES
('ADMINISTRADOR'),
('OPERADOR'),
('PRODUCTOR'),
('COMPRADOR');

-- =========================
-- INSERTAR UNIDADES
-- =========================

INSERT INTO unidades_medida (nombre)
VALUES
('Quintal'),
('Libra'),
('Caja'),
('Costal'),
('Unidad');

-- =========================
-- INSERTAR PRODUCTOS
-- =========================

INSERT INTO productos (nombre, categoria)
VALUES
('Tomate', 'Verduras'),
('Papa', 'Verduras'),
('Cebolla', 'Verduras'),
('Maiz', 'Granos'),
('Frijol', 'Granos');

-- =========================
-- PUNTOS DE ENTREGA INICIALES
-- =========================

INSERT INTO puntos_entrega (nombre, direccion) VALUES
('Terminal Central', 'Punto de encuentro principal'),
('Terminal Local La Esperanza', 'Punto comunitario'),
('Mercado Comunal', 'Área de carga y descarga');

-- =========================
-- USUARIOS INICIALES
-- Contraseña para todos: 123456
-- =========================

INSERT INTO usuarios (nombre, telefono, ubicacion, username, password, rol_id)
VALUES
('Admin Asociación', '50000001', 'La Esperanza', 'admin', '$2b$10$oQzyxJiAilMs/pte32sHKeUTOSQGsbo41ssSUT/2diNCFeTdCMzJm', 1),
('Productor La Esperanza', '50000002', 'La Esperanza', 'productor', '$2b$10$oQzyxJiAilMs/pte32sHKeUTOSQGsbo41ssSUT/2diNCFeTdCMzJm', 3),
('Comprador Terminal Central', '50000003', 'Terminal Central', 'comprador', '$2b$10$oQzyxJiAilMs/pte32sHKeUTOSQGsbo41ssSUT/2diNCFeTdCMzJm', 4),
('Operador Asociación', '50000004', 'La Esperanza', 'operador', '$2b$10$oQzyxJiAilMs/pte32sHKeUTOSQGsbo41ssSUT/2diNCFeTdCMzJm', 2);

-- =========================
-- PUBLICACIONES INICIALES
-- =========================

INSERT INTO publicaciones (productor_id, producto_id, unidad_id, cantidad, precio_referencial, descripcion)
VALUES
(2, 1, 3, 25, 120.00, 'Tomate fresco listo para entrega'),
(2, 4, 1, 10, 180.00, 'Maíz por quintal, cosecha reciente');
