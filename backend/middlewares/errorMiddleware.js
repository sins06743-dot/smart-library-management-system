// Centralized error handling middleware
// Handles various types of errors and sends appropriate responses

const errorMiddleware = (err, req, res, next) => {
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 400;
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // Handle MongoDB Duplicate Key Error
  if (err.code === 11000) {
    message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    statusCode = 400;
  }

  // Handle JWT Invalid Token Error
  if (err.name === "JsonWebTokenError") {
    message = "JSON Web Token is invalid. Please log in again.";
    statusCode = 401;
  }

  // Handle JWT Token Expired Error
  if (err.name === "TokenExpiredError") {
    message = "JSON Web Token has expired. Please log in again.";
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorMiddleware;
