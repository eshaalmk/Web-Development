const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Schema for users collection
const userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  }

});

// Create model
const UserModel = mongoose.model("User", userSchema);


// AI Version User Class
class User {

  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  // REGISTER METHOD
  async register() {

    // Check if user already exists
    const existingUser = await UserModel.findOne({ username: this.username });

    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Create new user
    const user = new UserModel({
      username: this.username,
      password: hashedPassword
    });

    await user.save();

    return "User registered successfully";
  }

  // LOGIN METHOD
  async login() {

    const user = await UserModel.findOne({ username: this.username });

    if (!user) {
      return null;
    }

    // Compare password
    const match = await bcrypt.compare(this.password, user.password);

    if (!match) {
      return null;
    }

    return user;

  }

}

module.exports = User;