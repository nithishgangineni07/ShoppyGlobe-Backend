import express from 'express';
import { protect } from '../middlewares/auth.js'; // Middleware to protect routes (ensures user is authenticated)
import { 
  getCart,        // Controller to get the current user's cart
  addToCart,      // Controller to add a product to the cart
  updateCartItem, // Controller to update quantity of a specific cart item
  removeFromCart  // Controller to remove an item from the cart
} from '../controllers/cartController.js';

const router = express.Router(); // Initialize Express router

// Apply authentication middleware to all routes below
// This ensures all cart operations are only allowed for logged-in users
router.use(protect);

// GET /api/cart
// Retrieves the authenticated user's cart
router.get('/', getCart);

// POST /api/cart
// Adds a product to the user's cart
router.post('/', addToCart);

// PUT /api/cart/:itemId
// Updates the quantity of a specific item in the cart
router.put('/:itemId', updateCartItem);

// DELETE /api/cart/:itemId
// Removes a specific item from the cart
router.delete('/:itemId', removeFromCart);

export default router; // Export the router to be used in the main application
