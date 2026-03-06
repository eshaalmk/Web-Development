const express = require("express");
const router = express.Router();

// Import User class
const User = require("../models/User");

// Import middleware
const authMiddleware = require("../middleware/authMiddleware");


// REGISTER ROUTE
router.post("/register", async (req, res) => {

  const { username, password } = req.body;

  const user = new User(username, password);

  try {

    const result = await user.register();

    res.send(result);

  } catch (error) {

    res.status(500).send(error.message);

  }

});



// LOGIN ROUTE
router.post("/login", async (req, res) => {

  const { username, password } = req.body;

  const user = new User(username, password);

  try {

    const result = await user.login();

    if (result) {

      // create session
      req.session.user = result.username;

      res.send("Login successful");

    } else {

      res.status(401).send("Invalid username or password");

    }

  } catch (error) {

    res.status(500).send(error.message);

  }

});



// DASHBOARD ROUTE (PROTECTED)
router.get("/dashboard", authMiddleware, (req, res) => {

  res.send(`Welcome ${req.session.user}`);

});



// LOGOUT ROUTE
router.get("/logout", (req, res) => {

  req.session.destroy();

  res.send("Logout successful");

});

module.exports = router;