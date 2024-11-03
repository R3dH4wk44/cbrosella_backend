// insertData.js

import pkg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Cargar las variables de entorno desde el archivo .env
dotenv.config({ path: path.resolve('./backend/.env') });
const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const insertData = async () => {
  try {
    // Ejemplo de usuarios
    const password1 = await bcrypt.hash('password123', 10);
    const password2 = await bcrypt.hash('password456', 10);
    
    const user1Id = uuidv4();
    const user2Id = uuidv4();
    await pool.query('DELETE FROM users');
    await pool.query(`
      INSERT INTO users (id, name, email, phone, password, is_admin) VALUES
      ($1, 'John Doe', 'john@example.com', '1234567890', $2, FALSE),
      ($3, 'Jane Smith', 'jane@example.com', '0987654321', $4, TRUE);
    `, [user1Id, password1, user2Id, password2]);

    console.log('Usuarios insertados correctamente');

    // Ejemplo de categorías
    const categoryId1 = 1;
    const categoryId2 = 2;

    await pool.query(`
      INSERT INTO category (id, name, description) VALUES
      ($1, 'Sports', 'Various sports categories'),
      ($2, 'Technology', 'Latest technology products');
    `, [categoryId1, categoryId2]);

    console.log('Categorías insertadas correctamente');

    // Ejemplo de equipos
    const teamId1 = uuidv4();
    const teamId2 = uuidv4();

    await pool.query(`
      INSERT INTO teams (id, name, description, category_id, image_url) VALUES
      ($1, 'Team A', 'Description for Team A', $2, 'https://example.com/team-a.png'),
      ($3, 'Team B', 'Description for Team B', $4, 'https://example.com/team-b.png');
    `, [teamId1, categoryId1, teamId2, categoryId2]);

    console.log('Equipos insertados correctamente');

    // Ejemplo de publicaciones
    await pool.query(`
      INSERT INTO post (id, title, content, featured_image) VALUES
      (uuid_generate_v4(), 'Post Title 1', 'Content for post 1', 'https://example.com/image1.png'),
      (uuid_generate_v4(), 'Post Title 2', 'Content for post 2', 'https://example.com/image2.png');
    `);

    console.log('Publicaciones insertadas correctamente');

    // Ejemplo de productos
    const productCategoryId1 = uuidv4();
    const productCategoryId2 = uuidv4();

    await pool.query(`
      INSERT INTO products_category (id, name, description) VALUES
      ($1, 'Electronics', 'Electronics category'),
      ($2, 'Clothing', 'Clothing category');
    `, [productCategoryId1, productCategoryId2]);

    const productId1 = uuidv4();
    const productId2 = uuidv4();

    await pool.query(`
      INSERT INTO products (id, name, description, price, quantity, product_category_id, featured_image, additional_images) VALUES
      ($1, 'Smartphone', 'Latest smartphone model', 699.99, 50, $2, 'https://example.com/smartphone.png', ARRAY['https://example.com/smartphone1.png', 'https://example.com/smartphone2.png']),
      ($3, 'T-Shirt', 'Comfortable cotton t-shirt', 19.99, 100, $4, 'https://example.com/tshirt.png', ARRAY['https://example.com/tshirt1.png', 'https://example.com/tshirt2.png']);
    `, [productId1, productCategoryId1, productId2, productCategoryId2]);

    console.log('Productos insertados correctamente');

  } catch (error) {
    console.error('Error al insertar datos:', error);
  } finally {
    await pool.end(); // Cerrar la conexión
  }
};

insertData();
