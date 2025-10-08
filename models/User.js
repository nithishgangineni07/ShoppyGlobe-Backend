import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define schema for a User document
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Provide Name'] // Name field is required with a custom error message
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'], // Email is required
    unique: true                                // Ensures no two users can register with the same email
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'] // Password is mandatory
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Mongoose pre-save middleware to hash the password before saving it to the database
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    // If password is not modified (e.g., updating other fields), skip hashing
    next();
  }

  const salt = await bcrypt.genSalt(10);              // Generate a salt with 10 rounds
  this.password = await bcrypt.hash(this.password, salt); // Hash the password and store it
});

// Instance method to compare entered password with the hashed password in the database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Returns true if matched, false otherwise
};

// Create User model from the schema
const User = mongoose.model('User', userSchema);

// Export the User model so it can be used in authentication, registration, etc.
export default User;
