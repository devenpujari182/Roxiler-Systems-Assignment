const pool = require('../config/db');
const storeRepository = require('../repositories/storeRepository');

/**
 * StoreService
 * Business logic for store listing as seen by authenticated regular users (USER role).
 */
const storeService = {
  /**
   * Get paginated list of stores with:
   * - avg_rating (from all ratings)
   * - user_rating: the requesting user's own rating for each store (null if not rated)
   *
   * @param {number} userId - ID of the requesting user (to find their personal rating)
   * @param {object} filters - { name, email, address }
   * @param {number} page
   * @param {number} limit
   * @param {string} sortBy
   * @param {string} sortOrder
   * @returns {{ stores: object[], total: number, page: number, limit: number, totalPages: number }}
   */
  async getStores(
    userId,
    filters = {},
    page = 1,
    limit = 10,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  ) {
    const { stores, total } = await storeRepository.findAll(
      filters,
      page,
      limit,
      sortBy,
      sortOrder
    );

    // For each store, attach the requesting user's own rating
    if (stores.length > 0) {
      const storeIds = stores.map((s) => s.id);

      // Fetch all user ratings for these stores in one query
      const placeholders = storeIds.map(() => '?').join(', ');
      const [userRatings] = await pool.execute(
        `SELECT id, store_id, rating FROM ratings WHERE user_id = ? AND store_id IN (${placeholders})`,
        [userId, ...storeIds]
      );

      // Build a quick lookup map
      const ratingMap = {};
      userRatings.forEach((r) => {
        ratingMap[r.store_id] = { rating: r.rating, id: r.id };
      });

      // Attach user_rating to each store
      stores.forEach((store) => {
        const userRatingData = ratingMap[store.id];
        store.user_rating = userRatingData ? userRatingData.rating : null;
        store.rating_id   = userRatingData ? userRatingData.id    : null;
        store.avg_rating  = parseFloat(store.avg_rating) || 0;
      });
    }

    const totalPages = Math.ceil(total / parseInt(limit));

    return {
      stores,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
    };
  },
};

module.exports = storeService;
