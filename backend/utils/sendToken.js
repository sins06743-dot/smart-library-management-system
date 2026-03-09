const jwt = require("jsonwebtoken");

// Generate JWT token, set cookie, and send response
const sendToken = (user, statusCode, res, message = "Success") => {
  // Create JWT token with user ID
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  // Cookie options
  const cookieOptions = {
    httpOnly: true, // Prevent XSS attacks
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    sameSite: "lax",
  };

  // Send token as cookie and in response
  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    message,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
      avatar: user.avatar,
    },
  });
};

module.exports = sendToken;
