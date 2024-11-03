// db.js
import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar .env desde la carpeta backend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env desde la carpeta backend
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const jwtSecret = process.env.JWT_SECRET;
const { Pool } = pkg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export  {pool, jwtSecret};
