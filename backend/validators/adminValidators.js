const { body } = require('express-validator');

/**
 * Reusable strong password rule factory
 */
const strongPasswordRules = (field = 'password') =>
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
 * addUserValidation
 * Admin adds a new user:
 * - name: 20–60 chars
 * - email: valid email
 * - password: 8–16 chars, 1 uppercase, 1 special char
 * - address: optional, max 400 chars
 * - role: must be one of ADMIN, USER, STORE_OWNER
 */
const addUserValidation = [
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

  strongPasswordRules('password'),

  body('address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters.'),

  body('role')
    .notEmpty()
    .withMessage('Role is required.')
    .isIn(['ADMIN', 'USER', 'STORE_OWNER'])
    .withMessage('Role must be one of: ADMIN, USER, STORE_OWNER.'),
];

/**
 * addStoreValidation
 * Admin adds a new store:
 * - name: 20–60 chars
 * - email: optional valid email
 * - address: optional, max 400 chars
 * - owner_id: optional integer (must reference a STORE_OWNER user)
 */
const addStoreValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Store name is required.')
    .isLength({ min: 20, max: 60 })
    .withMessage('Store name must be between 20 and 60 characters.'),

  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Please provide a valid store email address.')
    .normalizeEmail(),

  body('address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters.'),

  body('owner_id')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('owner_id must be a positive integer.')
    .toInt(),
];

module.exports = {
  addUserValidation,
  addStoreValidation,
};
