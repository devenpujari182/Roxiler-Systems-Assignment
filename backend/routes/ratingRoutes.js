const express = require('express');
const router = express.Router();

const ratingController = require('../controllers/ratingController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { submitRatingValidation, updateRatingValidation } = require('../validators/ratingValidators');

/**
 * POST /api/ratings
 * Submit a new rating for a store.
 * Requires authentication and USER role.
 * Body: { store_id, rating }
 */
router.post(
  '/',
  authenticate,
  authorize('USER'),
  submitRatingValidation,
  validate,
  ratingController.submitRating
);

/**
 * PUT /api/ratings/:id
 * Update an existing rating by its ID.
 * Requires authentication and USER role. User must own the rating.
 * Body: { rating }
 */
router.put(
  '/:id',
  authenticate,
  authorize('USER'),
  updateRatingValidation,
  validate,
  ratingController.updateRating
);

module.exports = router;
