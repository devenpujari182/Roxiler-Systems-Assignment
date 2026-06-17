const { body } = require('express-validator');

/**
 * Password must be 8–16 chars, at least 1 uppercase letter, at least 1 special character.
 */
const passwordRules = (field = 'password') =>
  body(field)
    .notEmpty()
    .withMessage(`${field} is required.`)
    .isLength({ min: 8, max: 16 })
    .withMessage(`${field} must be between 8 and 16 characters.`)
    .matches(/[A-Z]/)
    .withMessage(`${field} must contain at least one uppercase letter.`)
    .matches(/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~;']/)
    .withMessage(`${field} must contain at least one special character.`);

/**
 * registerValidation
 * Validates user registration input:
 * - name: 20–60 chars
 * - email: valid email format
 * - password: 8–16 chars, 1 uppercase, 1 special char
 * - address: optional, max 400 chars
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters.'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  passwordRules('password'),

  body('address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters.'),
];

/**
 * loginValidation
 * Validates login credentials:
 * - email: valid format
 * - password: not empty
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required.'),
];

/**
 * changePasswordValidation
 * Validates password change request:
 * - currentPassword: not empty
 * - newPassword: 8–16 chars, 1 uppercase, 1 special char
 */
const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),

  passwordRules('newPassword'),

  body('newPassword').custom((value, { req }) => {
    if (value === req.body.currentPassword) {
      throw new Error('New password must be different from current password.');
    }
    return true;
  }),
];

module.exports = {
  registerValidation,
  loginValidation,
  changePasswordValidation,
};
