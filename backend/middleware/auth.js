const jwt = require('jsonwebtoken');
const { error } = require('../utils/responseHelper');

/**
 * authenticate middleware
 * Validates Bearer JWT token from Authorization header.
 * Attaches decoded { id, email, role } to req.user on success.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Access denied. No token provided.', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Token has expired. Please log in again.', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return error(res, 'Invalid token. Please log in again.', 401);
    }
    return error(res, 'Authentication failed.', 401);
  }
};

/**
 * authorize middleware factory
 * Returns middleware that checks if req.user.role is among the allowed roles.
 * @param {...string} roles - Allowed roles (e.g., 'ADMIN', 'USER', 'STORE_OWNER')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Access denied. Not authenticated.', 401);
    }
    if (!roles.includes(req.user.role)) {
      return error(
        res,
        `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}.`,
        403
      );
    }
    next();
  };
};

module.exports = { authenticate, authorize };
