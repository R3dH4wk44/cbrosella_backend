import express from 'express';
import {pool} from '../db_config/db.js';
import { productSchema } from '../shcemas/productSchema.js';
import { union } from 'zod';
const router = express.Router();


router.get('/all', async (req, res) => {
    try {
      const products = await pool.query('SELECT * FROM products;');
      const categories = await pool.query('SELECT * FROM product_category');
      res.json( { products: products.rows, categories: categories.rows});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  });


  router.get('/:id', async (req, res) => { 
    try {
      const { id } = req.params;
      const product = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      res.json(product.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  });


  router.get('/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const products = await pool.query('SELECT * FROM products WHERE products_category = $1', [category]);
      res.json(products.rows);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: 'Categoría no encontrada' });
    }
  })
  
  

  router.post('/create', async (req, res) => {
    try {

      const validatedData = productSchema.parse(req.body);
  
      const {
        name,
        description,
        price,
        quantity,
        product_category_id,
        featured_image,
        additional_images = [], 
      } = validatedData;
  
      const result = await pool.query(
        `INSERT INTO products (name, description, price, quantity, product_category_id, featured_image, additional_images)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          name,
          description || null,
          price,
          quantity,
          product_category_id,
          featured_image || null,
          additional_images,
        ]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Error creating product' });
    }
  });

  router.put('/update/:id', async (req, res) => {
    try {
        const { name, description, price, quantity, product_category_id, featured_image, additional_images, } = req.body;
        const { id } = req.params;
        

        const existingResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        const existingProduct = existingResult.rows[0];

        if (!existingProduct) {
            return res.status(404).json({ message: 'El producto no fue encontrado' });
        }

        const updatedProduct = {
            name: name?? existingProduct.name,  
            description: description ?? existingProduct.description,
            quantity: quantity ?? existingProduct.quantity,
            price: price ?? existingProduct.price,  
            product_category_id: product_category_id ?? existingProduct.product_category_id,
            featured_image: featured_image ?? existingProduct.featured_image,
            additional_images: additional_images?? existingProduct.additional_images,  
        };

        const result = await pool.query(
            `UPDATE products 
             SET name = $1, description = $2, quantity = $3 , price = $4, product_category_od = $5, featured_image = $6, additional_images = $7
             WHERE id = $5 RETURNING *`,
            [updatedProduct.name, updatedProduct.description, updatedProduct.quantity, updatedProduct.price, updatedProduct.product_category_id, updatedProduct.featured_image, updatedProduct.additional_images, id]
        );

        res.json(result.rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al modificar el producto' });
    }
});


  router.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'El producto no fue encontrado' });
      }
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar el producto' });
    }
  });


  export default router;