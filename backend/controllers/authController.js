const authService = require('../services/authService');
const { success, error } = require('../utils/responseHelper');

/**
 * AuthController
 * Handles HTTP layer for auth endpoints.
 * Delegates all business logic to authService.
 */
const authController = {
  /**
   * POST /api/auth/register
   * Register a new user account.
   */
  async register(req, res, next) {
    try {
      const { name, email, password, address } = req.body;
      const user = await authService.register({ name, email, password, address });
      return success(res, { user }, 'Registration successful. Welcome!', 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/auth/login
   * Authenticate and receive a JWT token.
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return success(res, result, 'Login successful.');
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/auth/change-password
   * Change the authenticated user's password.
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      await authService.changePassword(userId, currentPassword, newPassword);
      return success(res, null, 'Password changed successfully.');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
