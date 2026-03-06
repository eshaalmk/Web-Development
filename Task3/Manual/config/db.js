// Import mongoose
const mongoose = require("mongoose");

// Function to connect MongoDB
const connectDB = async () => {
  try {

    // Connect to MongoDB database studentDB
    await mongoose.connect("mongodb://localhost:27017/studentDB");

    console.log("MongoDB Connected Successfully");

  } catch (error) {

    console.error("MongoDB Connection Error:", error);
    process.exit(1);

  }
};

// Export the function
module.exports = connectDB;