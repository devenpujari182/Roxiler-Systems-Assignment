const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { addUserValidation, addStoreValidation } = require('../validators/adminValidators');

// All admin routes require authentication and ADMIN role
router.use(authenticate, authorize('ADMIN'));

/**
 * GET /api/admin/dashboard
 * Platform statistics: total users, stores, ratings.
 */
router.get('/dashboard', adminController.getDashboard);

/**
 * POST /api/admin/users
 * Create a new user with any role.
 */
router.post('/users', addUserValidation, validate, adminController.addUser);

/**
 * GET /api/admin/users
 * Paginated, filterable, sortable list of all users.
 * Query: name, email, role, page, limit, sortBy, sortOrder
 */
router.get('/users', adminController.getUsers);

/**
 * GET /api/admin/users/:id
 * Get a single user. STORE_OWNERs include store avg rating.
 */
router.get('/users/:id', adminController.getUserById);

/**
 * POST /api/admin/stores
 * Create a new store.
 */
router.post('/stores', addStoreValidation, validate, adminController.addStore);

/**
 * GET /api/admin/stores
 * Paginated, filterable, sortable list of all stores with avg_rating.
 * Query: name, email, address, page, limit, sortBy, sortOrder
 */
router.get('/stores', adminController.getStores);

module.exports = router;
