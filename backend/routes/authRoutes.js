const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  registerValidation,
  loginValidation,
  changePasswordValidation,
} = require('../validators/authValidators');

/**
 * POST /api/auth/register
 * Register a new user account.
 */
router.post('/register', registerValidation, validate, authController.register);

/**
 * POST /api/auth/login
 * Login and receive a JWT token.
 */
router.post('/login', loginValidation, validate, authController.login);

/**
 * POST /api/auth/change-password
 * Change the authenticated user's password.
 * Requires a valid Bearer token.
 */
router.post(
  '/change-password',
  authenticate,
  changePasswordValidation,
  validate,
  authController.changePassword
);

module.exports = router;
