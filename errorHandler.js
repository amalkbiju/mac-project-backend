const errorHandler = (err, req, res, next) => {
  // Log the error details (optional: write to a file or external service)
  console.error(err.stack);

  // Set default status and message
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Send response
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
