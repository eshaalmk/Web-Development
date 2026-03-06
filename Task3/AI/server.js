const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(express.json());

// Session setup
app.use(session({
  secret: "superSecretKey",
  resave: false,
  saveUninitialized: false
}));

// Routes
app.use("/", authRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("AI Login System Running");
});

// Start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});