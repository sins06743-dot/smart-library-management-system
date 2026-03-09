const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("./catchAsyncErrors");
const User = require("../models/userModel");

// Middleware to check if the user is authenticated
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // Get token from cookies
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please log in to access this resource",
    });
  }

  // Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Attach the user to request object
  req.user = await User.findById(decoded.id);

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User not found. Please log in again.",
    });
  }

  next();
});

// Middleware to restrict access to admin only
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
  }
  next();
};
