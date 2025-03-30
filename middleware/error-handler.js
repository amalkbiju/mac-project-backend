const { APIError } = require("../errors/APIError");

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Handle our custom API errors
  console.log("err instanse ", err instanceof APIError);
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Handle all unexpected errors
  res.status(500).json({
    message: "Something went wrong",
  });
};

module.exports = errorHandler;
