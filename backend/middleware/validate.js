const { validationResult } = require('express-validator');
const { error } = require('../utils/responseHelper');

/**
 * validate middleware
 * Checks the result of express-validator chains.
 * If there are validation errors, returns 422 with an array of { field, message } objects.
 * Otherwise, calls next() to continue to the controller.
 */
const validate = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const formattedErrors = result.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return error(res, 'Validation failed.', 422, formattedErrors);
  }

  next();
};

module.exports = validate;
