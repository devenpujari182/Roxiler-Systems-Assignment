const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * GET /api/stores
 * Retrieve paginated, filterable list of stores with avg_rating and the user's own rating.
 * Requires authentication and USER role.
 * Query params: name, email, address, page, limit, sortBy, sortOrder
 */
router.get('/', authenticate, authorize('USER'), storeController.getStores);

module.exports = router;
