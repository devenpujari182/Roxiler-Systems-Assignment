/**
 * Global Express Error Handler Middleware
 * Must be registered AFTER all routes in server.js
 */

const { error: sendError } = require('../utils/responseHelper');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('[ErrorHandler]', err);

  // express-validator ValidationError (from validationResult)
  if (err.type === 'validation') {
    return sendError(res, 'Validation failed.', 422, err.errors);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token has expired. Please log in again.', 401);
  }
  if (err.name === 'NotBeforeError') {
    return sendError(res, 'Token not yet active.', 401);
  }

  // MySQL Duplicate Entry
  if (err.code === 'ER_DUP_ENTRY') {
    const match = err.message.match(/for key '(.+?)'/);
    const field = match ? match[1] : 'field';
    return sendError(res, `Duplicate entry: a record with this ${field} already exists.`, 409);
  }

  // MySQL Foreign Key Constraint
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return sendError(res, 'Referenced record does not exist.', 400);
  }

  // MySQL Row Not Found / Other DB Errors
  if (err.code && err.code.startsWith('ER_')) {
    return sendError(res, 'A database error occurred.', 500);
  }

  // Syntax errors in JSON body
  if (err.type === 'entity.parse.failed') {
    return sendError(res, 'Invalid JSON in request body.', 400);
  }

  // Custom application errors with explicit status
  if (err.statusCode) {
    return sendError(res, err.message || 'An error occurred.', err.statusCode);
  }

  // Generic / Unhandled errors
  const statusCode = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error';

  return sendError(res, message, statusCode);
};

module.exports = errorHandler;
