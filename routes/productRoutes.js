import express from 'express';
import { 
  getProducts,      // Controller to fetch all products
  getProductById,   // Controller to fetch a single product by its ID
  createProduct,    // Controller to add a new product
  seedProducts      // Controller to insert a bulk set of sample products (seeding)
} from '../controllers/productController.js';

const router = express.Router(); // Create a new router instance

// Route: GET /api/products
//        POST /api/products
// GET - Retrieves all products
// POST - Creates a new product
router.route('/')
  .get(getProducts)
  .post(createProduct);

// Route: GET /api/products/:id
// Fetch a single product based on its MongoDB ObjectId or custom productId
router.get('/:id', getProductById);

// Route: POST /api/products/seed
// Seeds the database with initial sample products (for testing or development)
router.post('/seed', seedProducts);

export default router; // Export the router to be used in your main server file
