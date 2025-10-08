// Import required models
import Cart from '../models/Cart.js'; // Cart model for cart operations
import Product from '../models/Product.js'; // Product model for product validation

// @desc    Get user cart
// @route   GET /cart
// @access  Private (requires authenticated user)
export const getCart = async (req, res) => {
  try {
    // Find cart for logged-in user and populate product details
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    // Return empty items array if no cart exists (HTTP 200 OK)
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    
    // Return the found cart (HTTP 200 OK)
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add item to cart
// @route   POST /cart
// @access  Private
export const addToCart = async (req, res) => {
  // Destructure product ID and quantity from request body
  const { productId, quantity } = req.body;

  try {
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check product stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: req.user._id });

    // Create new cart if none exists
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity }]
      });
      await cart.save();
      return res.status(201).json(cart); // HTTP 201 Created
    }

    // Check if product already exists in cart
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex >= 0) {
      // Increment quantity if product exists in cart
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new product to cart if it doesn't exist
      cart.items.push({ product: productId, quantity });
    }

    // Save updated cart and return (HTTP 200 OK)
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /cart/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  // Get new quantity from request body
  const { quantity } = req.body;

  try {
    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find item index in cart items array
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );

    // Validate item exists in cart
    if (itemIndex < 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Check product stock for the new quantity
    const product = await Product.findById(cart.items[itemIndex].product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Update quantity and save cart
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.json(cart); // HTTP 200 OK
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /cart/:itemId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find item index in cart items array
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );

    // Validate item exists in cart
    if (itemIndex < 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove item from array and save cart
    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.json(cart); // HTTP 200 OK
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};