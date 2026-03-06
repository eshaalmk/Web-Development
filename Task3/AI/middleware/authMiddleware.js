// Middleware to protect routes

const authMiddleware = (req, res, next) => {

  // Check if session exists
  if (req.session.user) {

    // Allow access
    next();

  } else {

    res.status(401).send("Access Denied. Please login first.");

  }

};

module.exports = authMiddleware;