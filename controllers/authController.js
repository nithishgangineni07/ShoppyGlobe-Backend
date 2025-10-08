// Import required modules
import jwt from 'jsonwebtoken'; // For creating JSON Web Tokens
import User from '../models/User.js'; // User model for database operations

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
export const register = async (req, res) => {
  // Destructure user data from request body
  const { name, email, password } = req.body;

  try {
    // Check if user already exists in database
    const userExists = await User.findOne({ email });
    if (userExists) {
      // Return error if user exists (HTTP 400 Bad Request)
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user in database
    const user = await User.create({
      name,
      email,
      password // Password will be hashed by the User model pre-save hook
    });

    if (user) {
      // If user creation successful (HTTP 201 Created)
      res.status(201).json({
        _id: user._id, // User ID from MongoDB
        name: user.name,
        email: user.email,
        token: generateToken(user._id) // Generate JWT for immediate authentication
      });
    } else {
      // If user creation failed (HTTP 400 Bad Request)
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    // Handle any unexpected errors (HTTP 500 Internal Server Error)
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /auth/login
// @access  Public
export const login = async (req, res) => {
  // Destructure login credentials from request body
  const { email, password } = req.body;

  try {
    // Find user by email in database
    const user = await User.findOne({ email });

    // Check if user exists and password matches (using model method)
    if (user && (await user.matchPassword(password))) {
      // Successful authentication (HTTP 200 OK)
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id) // Generate new JWT
      });
    } else {
      // Authentication failed (HTTP 401 Unauthorized)
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    // Handle any unexpected errors (HTTP 500 Internal Server Error)
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Helper function to generate JSON Web Token
const generateToken = (id) => {
  return jwt.sign(
    { id }, // Payload containing user ID
    process.env.JWT_SECRET, // Secret key from environment variables
    {
      expiresIn: '30d' // Token expires in 30 days
    }
  );
};