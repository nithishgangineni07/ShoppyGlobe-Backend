# ShoppyGlobe Backend

ShoppyGlobe is a backend API for an e-commerce platform, developed with Node.js, Express.js, and MongoDB. It provides core functionalities such as product catalog management, user registration and login, and a secure shopping cart system. The API is designed for reliability and ease of integration with frontend applications.

---

## github repository

🔗 [ShoppyGlobe github repository](https://github.com/WasiuzzamanAnsari/shoppyglobe-backend.git)

---

## 🧾 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Setup](#project-setup)
- [Development Commands](#development-commands)
- [Production Commands](#production-commands)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)

---

## 🚀 Features

- ✅ User Authentication: Secure user registration and login using hashed passwords.

- 🛍️ Product Management: Full set of APIs to create, read, update, and delete products.

- 🛒 Shopping Cart System: Easily add, update, or remove items from the cart.

- 🚫 Centralized Error Handling: Middleware to manage and respond to errors consistently.

- 🗃️ MongoDB Integration: Seamless connection with MongoDB, compatible with Compass for easy DB visualization.

- 🌐 RESTful Architecture: Clean and scalable REST API design for smooth frontend integration.

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- dotenv for environment variables

---

## 🧩 Project Setup

### 1. Clone the Repository

```bash
git clone hhttps://github.com/WasiuzzamanAnsari/shoppyglobe-backend.git
cd ShoppyGlobe_backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shoppyglobe
JWT_SECRET=your_jwt_secret_here
```

## Environment Variables

This project uses environment variables to configure sensitive information.

1. Create a `.env` file in the root directory of the project.
2. Copy the contents from `.env` and fill in the values.

### 4. Set up MongoDB Locally

- Download MongoDB and install MongoDB Compass: [https://www.mongodb.com/products/self-managed/community-edition](https://www.mongodb.com/products/self-managed/community-edition)
- Start MongoDB Server
- Open MongoDB Compass
- Connect using:

```
mongodb://localhost:27017/shoppyglobe
```

- Create a database called `shoppyglobe` manually or it will be auto-created on app start.

---

## Development Commands

```bash
npm run dev     # Start server with nodemon for auto-reloading
```

### Optional: Seed Products Data

```bash
npm run import:products  # Runs importProducts.js to populate products collection
```

---

## Production Commands

```bash
npm start       # Runs app in production mode (without nodemon)
```

---

## 🔌 API Endpoints

### Auth

- `POST /register` – Register new user
- `POST /login` – Login user and return token

### Products

- `GET /products` – Get all products
- `GET /products/:id` – Get product by ID
- `POST /products` – Add a product

### Cart _(Protected Routes)_

- `GET /cart` – Get current user cart
- `POST /cart` – Add product to cart
- `PUT /cart/:productId` – Update cart item
- `DELETE /cart/:productId` – Remove item from cart

---

## 📁 Folder Structure

```
shoppyglobe-backend/
│
├── config/
│   └── db.js                        # (Assumed file for DB configuration - not visible in screenshot)
│
├── controllers/
│   ├── authController.js           # Handles user authentication (register, login)
│   ├── cartController.js           # Handles cart-related logic
│   └── productController.js        # Handles product-related logic
│
├── middlewares/
│   ├── auth.js                     # Middleware to protect routes (JWT auth)
│   └── error.js                    # Middleware to handle errors
│
├── models/
│   ├── Cart.js                     # Mongoose schema/model for Cart
│   ├── Product.js                  # Mongoose schema/model for Product
│   └── User.js                     # Mongoose schema/model for User
│
├── node_modules/                   # Installed npm packages
│
├── routes/
│   ├── authRoutes.js               # Auth route handlers (/register, /login)
│   ├── cartRoutes.js               # Cart route handlers (/cart endpoints)
│   └── productRoutes.js            # Product route handlers (/products endpoints)
│
├── utils/
│   └── seedProducts.js             # Script to seed product data from DummyJSON
│
├── .env                            # Environment variables
├── .gitignore                      # Git ignore file
├── app.js                          # Main application entry point (Express setup)
├── importProducts.js               # Possibly to manually import/seed products
├── package.json                    # Project metadata and dependencies
├── package-lock.json               # Dependency lock file
└── README.md                       # Project documentation

```

### NOTE: Seed Products Data into DataBase before Calling APIs

```bash
npm run import:products  # Runs importProducts.js to populate products collection
```

---

## 📬 Sample Request Body

Below are some example JSON payloads for making requests to various endpoints:

### 🔐 Register User

`POST /register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 🔐 Login User

`POST /login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 🛒 Add Product to Cart

`POST /cart`
(Requires Bearer Token)

```json
{
  "productId": "YOUR_PRODUCT_ID_HERE",
  "quantity": 2
}
```

### 🛒 Update Cart Item Quantity

`PUT /cart/:productId`
(Requires Bearer Token)

```json
{
  "quantity": 3
}
```

### ❌ Remove Product from Cart

`DELETE /cart/:productId`
(Requires Bearer Token)
(No body required)

### Create and Update products

`(POST/PUT) /products`
(body required)

```json
{
  "title": "Cool Gadget",
  "description": "Awesome features",
  "price": 199,
  "stock": 50,
  "category": "gadgets"
}
```