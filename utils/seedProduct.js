import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Product from "../models/Product.js"; 

dotenv.config();

// connect to MongoDB
const connectDB = async () => {
mongoose.connect("mongodb://localhost:27017/")
  .then(() => console.log('Connected to MongoDB')) // Log successful connection
  .catch(err => console.error('MongoDB connection error:', err)); // Catch and log connection errors
};

const importData = async () => {
  try {
    // fetch dummy products from API
    const { data } = await axios.get("https://dummyjson.com/products");
    const products = data.products;

    // clear existing products (optional)
    await Product.deleteMany();

    // insert new products
    await Product.insertMany(products);

    console.log("🌱 Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

await connectDB();
await importData();
