// Import mongoose
const mongoose = require("mongoose");

// Connect to MongoDB using async function
const connectDB = async () => {
  try {

    // Database connection
    await mongoose.connect("mongodb://127.0.0.1:27017/studentDB");

    console.log("MongoDB connected successfully");

  } catch (error) {

    console.error("Database connection failed:", error.message);
    process.exit(1);

  }
};

module.exports = connectDB;