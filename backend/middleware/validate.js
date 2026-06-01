// backend/middleware/validate.js
// Reads the result of express-validator checks and returns a 400 response
// if any validation rule failed.
// Use this as the last middleware in a validation chain:
//   router.post("/add-book", auth, adminOnly, bookValidation, validate, addBook)

const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field:   e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

module.exports = { validate };
