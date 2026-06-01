// backend/middleware/errorHandler.js
// Global error handler — registered last in app.js.
// Express knows this is an error handler because it has 4 parameters (err, req, res, next).
// Any route or middleware can call next(error) to reach this handler.

const errorHandler = (err, req, res, next) => {
  // Log full error details on the server for debugging
  console.error(`[ERROR] ${req.method} ${req.url} — ${err.message}`);

  const statusCode = err.statusCode || 500;
  const message    = err.message    || "Internal Server Error";

  res.status(statusCode).json({
    message,
    // Only expose the stack trace in development mode — never in production
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
