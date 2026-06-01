// backend/utils/AppError.js
// A custom error class that lets you attach an HTTP status code to any error.
// Usage: throw new AppError("Book not found", 404)
// Or:    return next(new AppError("Unauthorized", 401))

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
    // Keeps the prototype chain correct in transpiled environments
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

module.exports = AppError;
