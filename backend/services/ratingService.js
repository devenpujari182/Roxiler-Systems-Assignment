const ratingRepository = require('../repositories/ratingRepository');
const storeRepository = require('../repositories/storeRepository');

/**
 * RatingService
 * Business logic for submitting and updating ratings.
 */
const ratingService = {
  /**
   * Submit a new rating for a store.
   * - Validates the store exists
   * - Checks that the user hasn't already rated this store
   * @param {number} userId - Authenticated user ID
   * @param {number} store_id
   * @param {number} rating - Integer 1–5
   * @returns {object} Created rating record
   * @throws {Error} 404 if store not found
   * @throws {Error} 409 if user has already rated this store
   */
  async submitRating(userId, store_id, rating) {
    const store = await storeRepository.findById(store_id);
    if (!store) {
      const err = new Error(`Store with id ${store_id} not found.`);
      err.statusCode = 404;
      throw err;
    }

    const existing = await ratingRepository.findByUserAndStore(userId, store_id);
    if (existing) {
      const err = new Error(
        'You have already rated this store. Use the update endpoint to change your rating.'
      );
      err.statusCode = 409;
      throw err;
    }

    const newRating = await ratingRepository.create({
      user_id: userId,
      store_id,
      rating,
    });

    return newRating;
  },

  /**
   * Update an existing rating.
   * - Verifies the rating exists
   * - Verifies ownership (the rating belongs to the requesting user)
   * @param {number} userId - Authenticated user ID
   * @param {number} ratingId - ID of the rating to update
   * @param {number} rating - New rating value (1–5)
   * @returns {object} Updated rating record
   * @throws {Error} 404 if rating not found
   * @throws {Error} 403 if user does not own this rating
   */
  async updateRating(userId, ratingId, rating) {
    const existingRating = await ratingRepository.findById(ratingId);
    if (!existingRating) {
      const err = new Error(`Rating with id ${ratingId} not found.`);
      err.statusCode = 404;
      throw err;
    }

    if (existingRating.user_id !== userId) {
      const err = new Error('You are not authorized to update this rating.');
      err.statusCode = 403;
      throw err;
    }

    const updatedRating = await ratingRepository.update(ratingId, rating);
    return updatedRating;
  },
};

module.exports = ratingService;
