// Import required modules
import jwt from 'jsonwebtoken'; // For JWT verification
import asyncHandler from 'express-async-handler'; // For handling async/await errors
import User from '../models/User.js'; // User model for database operations

/**
 * @desc    Authentication middleware to protect routes
 * @middleware
 * @access  Private
 * 
 * This middleware:
 * 1. Checks for JWT token in Authorization header
 * 2. Verifies the token
 * 3. Attaches the authenticated user to the request object
 * 4. Handles various error cases appropriately
 */
const protect = asyncHandler(async (req, res, next) => {
  let token; // Variable to store the JWT token

  // Check if authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token and decode its payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user by ID from decoded token, excluding the password field
      req.user = await User.findById(decoded.id).select('-password');
      
      // Proceed to the next middleware/route handler
      next();
    } catch (error) {
      // Handle various JWT verification errors
      console.error('JWT Verification Error:', error);
      
      // Differentiate between token expiration and other errors
      const errorMessage = error.name === 'TokenExpiredError' 
        ? 'Not authorized, token expired'
        : 'Not authorized, token failed';
      
      res.status(401);
      throw new Error(errorMessage);
    }
  }

  // If no token was found in the header
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect };