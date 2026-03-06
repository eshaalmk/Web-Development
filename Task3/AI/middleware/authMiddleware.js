// Middleware to protect routes

const authMiddleware = (req, res, next) => {

  // Check if session exists
  if (!req.session.user) {
    return res.status(401).json({
      message: "Unauthorized. Please login first."
    });
  }

  next();
};

module.exports = authMiddleware;