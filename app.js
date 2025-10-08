import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import productRoutes from './routes/productRoutes.js'; // Routes for handling product-related APIs
import cartRoutes from './routes/cartRoutes.js';       // Routes for cart operations
import authRoutes from './routes/authRoutes.js';       // Routes for authentication (register/login)
import { errorHandler, notFound } from './middlewares/error.js'; // Custom error-handling middlewares

dotenv.config(); // Load environment variables from .env file

const app = express(); // Initialize express app

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON request bodies

// Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB')) // Log successful connection
  .catch(err => console.error('MongoDB connection error:', err)); // Catch and log connection errors

// Route handling
app.use('/products', productRoutes); // All product routes are prefixed with /products
app.use('/cart', cartRoutes);        // All cart routes are prefixed with /cart
app.use('/auth', authRoutes);        // All auth routes are prefixed with /auth

app.use(notFound); // Handle any routes not matched above (404 Not Found)

// Centralized error handler middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start listening on the specified port





