import { z } from 'zod'

const productSchema = z.object({
    name: z.string().min(1, 'Product name is required').max(255),
    description: z.string().optional(),
    price: z.number().positive('Price must be a positive number'),
    quantity: z.number().int().nonnegative('Quantity must be a non-negative integer'),
    product_category_id: z.string().uuid('Invalid category ID format'),
    featured_image: z.string().url('Featured image must be a valid URL').optional(),
    additional_images: z.array(z.string().url()).optional(),
  });


  export { productSchema };