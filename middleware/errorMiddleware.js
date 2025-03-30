const { handleError } = require("../utils/errorHandler");

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Handle specific types of errors
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  if (err.code === 11000) {
    err.statusCode = 400;
    err.message = "Duplicate field value entered";
  }
  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.message = "Invalid token. Please log in again";
  }

  handleError(err, res);
};

module.exports = errorMiddleware;
