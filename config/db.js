import mongoose from 'mongoose';


// Define an asynchronous function to connect to MongoDB
export async function connectDB(uri) {
  try {
    
    await mongoose.connect(uri);
    //log success message if connection is successful
    console.log('MongoDB connected');
  } catch (err) {

    //log any errrors that occur during connecting the database
    console.error('MongoDB connection error:', err);
    //exit the process with code 1 if the connection fails
    process.exit(1);
  }
}
