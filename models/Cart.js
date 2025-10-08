import mongoose from 'mongoose';

// Define schema for individual items in the cart
const cartItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId,  // Reference to a Product document
    ref: 'Product',                        // This tells Mongoose to populate this field with data from the 'Product' collection
    required: true                         // Ensures that every cart item must have an associated product
  },
  quantity: { 
    type: Number,                          // Quantity of the product in the cart
    required: true,                        // Quantity is mandatory
    min: 1                                 // Quantity must be at least 1
  }
});

// Define schema for the cart itself
const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,  // Reference to the User who owns this cart
    ref: 'User',                           // Tells Mongoose to populate this field from the 'User' collection
    required: true,                        // Every cart must be linked to a user
    unique: true                           // Ensures each user can have only one cart
  },
  items: [cartItemSchema]                  // Array of cart items defined using the cartItemSchema
}, { timestamps: true });                  // Automatically adds createdAt and updatedAt timestamps

// Create the Cart model using the schema
const Cart = mongoose.model('Cart', cartSchema);

// Export the model so it can be used in other parts of the application
export default Cart;
