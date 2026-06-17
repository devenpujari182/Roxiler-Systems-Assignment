/**
 * Response Helper Utilities
 * Standardizes API response format across all endpoints
 */

/**
 * Send a success response
 * @param {object} res - Express response object
 * @param {*} data - Response payload
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default 200)
 */
const success = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
  };
  if (data !== null && data !== undefined) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {*} errors - Additional error details (optional)
 */
const error = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors !== null && errors !== undefined) {
    response.errors = errors;
  }
  return res.status(statusCode).json(response);
};

module.exports = { success, error };
