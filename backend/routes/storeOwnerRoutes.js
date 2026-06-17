const express = require('express');
const router = express.Router();

const storeOwnerController = require('../controllers/storeOwnerController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * GET /api/store-owner/dashboard
 * Returns the store owner's store info, avg rating, and paginated rater list.
 * Requires authentication and STORE_OWNER role.
 * Query params: page, limit, sortBy, sortOrder, search
 */
router.get(
  '/dashboard',
  authenticate,
  authorize('STORE_OWNER'),
  storeOwnerController.getDashboard
);

module.exports = router;
