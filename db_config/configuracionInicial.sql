CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- Habilita la extensión para UUIDs en PostgreSQL

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),       -- UUID único generado automáticamente
    name VARCHAR(100) NOT NULL,                           -- Nombre del usuario
    email VARCHAR(100) UNIQUE NOT NULL,                   -- Email único
    phone VARCHAR(15),                                    -- Teléfono de contacto
    password VARCHAR(255) NOT NULL,                       -- Contraseña encriptada
    is_admin BOOLEAN DEFAULT FALSE,                       -- Indica si es administrador (por defecto FALSE)
    created_at TIMESTAMP DEFAULT NOW()                    -- Fecha de creación
);

CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY,                                -- Autoincrementable en PostgreSQL
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INT NOT NULL,
    image_url VARCHAR(255),                               -- URL para almacenar la imagen de Cloudflare
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE IF NOT EXISTS post (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    featured_image VARCHAR(255)                           -- URL para almacenar la imagen de Cloudflare
);

CREATE TABLE IF NOT EXISTS game (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL,
    rival VARCHAR(255) NOT NULL,
    team_score INT NOT NULL,
    rival_score INT NOT NULL,
    is_local BOOLEAN NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS products_category (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    product_category_id UUID NOT NULL,
    featured_image VARCHAR(255),                     -- URL para la imagen destacada
    additional_images TEXT[],                        -- Array de URLs para imágenes adicionales
    FOREIGN KEY (product_category_id) REFERENCES products_category(id)
);
