import express from 'express';
import { register, login } from '../controllers/authController.js'; // Import controller functions for registration and login

const router = express.Router(); // Create a new router instance

// Route for user registration
// POST /api/auth/register
// Calls the `register` function from authController
router.post('/register', register);

// Route for user login
// POST /api/auth/login
// Calls the `login` function from authController
router.post('/login', login);

export default router; // Export the router so it can be used in your main app
