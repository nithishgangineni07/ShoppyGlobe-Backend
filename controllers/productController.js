import Product from '../models/Product.js'; // Import Product model for database operations
import axios from 'axios'; // Import axios for making HTTP requests to external APIs

// @desc    Fetch all products with optional filtering
// @route   GET /products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    // Extract category from query parameters if provided
    const { category } = req.query;
    
    // Prepare query object - include category filter if specified
    const query = category ? { category } : {};
    
    // Fetch products from database (with optional filtering)
    const products = await Product.find(query);
    
    // Return success response with product count and data
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server Error' 
    });
  }
};

// @desc    Fetch single product by ID
// @route   GET /products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    // Find product by ID from route parameters
    const product = await Product.findById(req.params.id);
    
    // Handle case where product doesn't exist
    if (!product) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }
    
    // Return success response with product data
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get Product Error:', error);
    
    // Handle invalid MongoDB ID format specifically
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }
    
    // Generic server error response
    res.status(500).json({ 
      success: false,
      error: 'Server Error' 
    });
  }
};

// @desc    Create a new product (Admin only)
// @route   POST /products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    // Destructure required fields from request body
    const { title, description, price, category, stock } = req.body;

    // Validate all required fields are present
    if (!title || !description || !price || !category || !stock) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields (title, description, price, category, stock)'
      });
    }

    // Create new product instance
    const product = new Product({
      title,
      description,
      price,
      category,
      stock,
      // Additional fields like images could be added here
    });

    // Save product to database
    const createdProduct = await product.save();

    // Return success response with created product (HTTP 201 Created)
    res.status(201).json({
      success: true,
      data: createdProduct
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    
    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(val => val.message)
      });
    }
    
    // Generic server error response
    res.status(500).json({ 
      success: false,
      error: 'Server Error' 
    });
  }
};

// @desc    Seed database with sample products from dummyjson.com
// @route   POST /products/seed
// @access  Public (typically would be protected in production)
export const seedProducts = async (req, res) => {
  try {
    // Fetch products from external API
    const response = await axios.get('https://dummyjson.com/products');
    const products = response.data.products;

    // Transform API data to match our Product schema
    const formattedProducts = products.map(product => ({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      rating: product.rating,      // Additional optional fields
      brand: product.brand,        // from the external API
      thumbnail: product.thumbnail,
      images: product.images
    }));

    // Clear existing products (optional - could also merge)
    await Product.deleteMany({});
    
    // Insert all transformed products in bulk
    const insertedProducts = await Product.insertMany(formattedProducts);

    // Return success response with count of seeded products
    res.status(201).json({
      success: true,
      message: 'Products seeded successfully',
      count: insertedProducts.length
    });
  } catch (error) {
    console.error('Seed Products Error:', error);
    
    // Return detailed error information
    res.status(500).json({ 
      success: false,
      error: 'Error seeding products',
      details: error.message 
    });
  }
};