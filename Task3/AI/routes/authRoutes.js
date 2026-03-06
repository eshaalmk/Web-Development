const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");


// REGISTER
router.post("/register", async (req, res) => {

  try {

    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    const user = new User(username, password);

    const result = await user.register();

    res.json({
      message: result
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});



// LOGIN
router.post("/login", async (req, res) => {

  try {

    const { username, password } = req.body;

    const user = new User(username, password);

    const result = await user.login();

    if (!result) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    // Create session
    req.session.user = result.username;

    res.json({
      message: "Login successful",
      user: result.username
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});



// DASHBOARD
router.get("/dashboard", authMiddleware, (req, res) => {

  res.json({
    message: `Welcome ${req.session.user}`
  });

});



// LOGOUT
router.get("/logout", (req, res) => {

  req.session.destroy(() => {

    res.json({
      message: "Logout successful"
    });

  });

});

module.exports = router;