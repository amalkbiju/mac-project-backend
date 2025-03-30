class APIError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundException extends APIError {
  constructor(message = "Resource not found") {
    super(message);
    this.statusCode = 404;
  }
}

class ServerError extends APIError {
  constructor(message = "Internal server error") {
    super(message);
    this.statusCode = 500;
  }
}

class BadRequestError extends APIError {
  constructor(message = "Bad request") {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = {
  APIError,
  NotFoundException,
  ServerError,
  BadRequestError,
};
