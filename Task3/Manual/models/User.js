// Import mongoose
const mongoose = require("mongoose");

// Create schema for user collection
const userSchema = new mongoose.Schema({

  // username field
  username: {
    type: String,
    required: true,
    unique: true
  },

  // password field
  password: {
    type: String,
    required: true
  }

});

// Create mongoose model
const UserModel = mongoose.model("User", userSchema);


// Create User class as required in assignment
class User {

  // constructor runs when object is created
  constructor(username, password) {

    this.username = username;
    this.password = password;

  }

  // Register method
  async register() {

    try {

      // Create new user document
      const newUser = new UserModel({
        username: this.username,
        password: this.password
      });

      // Save user to MongoDB
      await newUser.save();

      return "User registered successfully";

    } catch (error) {

      throw new Error("Registration failed");

    }

  }

  // Login method
  async login() {

    try {

      // Find user in database
      const user = await UserModel.findOne({
        username: this.username,
        password: this.password
      });

      // If user exists return true
      if (user) {
        return user;
      }

      return null;

    } catch (error) {

      throw new Error("Login failed");

    }

  }

}

// Export class
module.exports = User;