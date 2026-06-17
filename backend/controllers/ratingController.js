const ratingService = require('../services/ratingService');
const { success } = require('../utils/responseHelper');

/**
 * RatingController
 * Handles HTTP layer for rating submission and updates.
 */
const ratingController = {
  /**
   * POST /api/ratings
   * Submit a new rating for a store.
   * Body: { store_id, rating }
   */
  async submitRating(req, res, next) {
    try {
      const { store_id, rating } = req.body;
      const userId = req.user.id;

      const newRating = await ratingService.submitRating(userId, parseInt(store_id), parseInt(rating));

      return success(res, { rating: newRating }, 'Rating submitted successfully.', 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/ratings/:id
   * Update an existing rating.
   * Body: { rating }
   */
  async updateRating(req, res, next) {
    try {
      const ratingId = parseInt(req.params.id);
      const { rating } = req.body;
      const userId = req.user.id;

      const updated = await ratingService.updateRating(userId, ratingId, parseInt(rating));

      return success(res, { rating: updated }, 'Rating updated successfully.');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = ratingController;
