// Import express
const express = require("express");

// Import session
const session = require("express-session");

// Import body-parser
const bodyParser = require("body-parser");

// Import DB connection
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");

const app = express();


// Connect MongoDB
connectDB();


// Middleware
app.use(bodyParser.json());


// Session setup
app.use(session({

  secret: "secretKey",
  resave: false,
  saveUninitialized: true

}));


// Routes
app.use("/", authRoutes);


// Start server
app.listen(3000, () => {

  console.log("Server running on port 3000");

});