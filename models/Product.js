import mongoose from 'mongoose';

// Define the schema for a Product document in MongoDB
const productSchema = new mongoose.Schema({
  // productId: { type: Number, unique: true, required: true },
  // Optional custom product ID field (commented out currently)

  title: { 
    type: String, 
    required: true // Title is mandatory
  },

  description: { 
    type: String, 
    required: true // Description is mandatory
  },

  price: { 
    type: Number, 
    required: true // Price is mandatory
  },

  discountPercentage: { 
    type: Number 
    // Optional field for discount percentage
  },

  rating: { 
    type: Number 
    // Optional field to store product rating (e.g., from 0 to 5)
  },

  stock: { 
    type: Number, 
    required: true // Required field to store available stock quantity
  },

  brand: { 
    type: String 
    // Optional field to store brand name
  },

  category: { 
    type: String 
    // Optional field to group products by category (e.g., electronics, fashion)
  },

  thumbnail: { 
    type: String 
    // URL to the main product image
  },

  images: [{ 
    type: String 
    // Array of URLs pointing to additional product images
  }]
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create a Product model from the schema
const Product = mongoose.model('Product', productSchema);

// Export the model so it can be used in routes, controllers, etc.
export default Product;
