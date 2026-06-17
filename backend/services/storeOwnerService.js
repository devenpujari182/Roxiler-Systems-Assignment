const storeRepository = require('../repositories/storeRepository');
const ratingRepository = require('../repositories/ratingRepository');

/**
 * StoreOwnerService
 * Business logic for store owner dashboard.
 */
const storeOwnerService = {
  /**
   * Get dashboard data for a store owner.
   * - Finds the store owned by the given ownerId
   * - Gets overall avg rating for the store
   * - Gets a paginated, sortable, searchable list of users who have rated the store
   *
   * @param {number} ownerId - The authenticated store owner's user ID
   * @param {object} options - { page, limit, sortBy, sortOrder, search }
   * @returns {object} Dashboard data
   * @throws {Error} 404 if the owner has no store assigned
   */
  async getDashboard(ownerId, options = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'r.created_at',
      sortOrder = 'DESC',
      search = '',
    } = options;

    const store = await storeRepository.findByOwnerId(ownerId);
    if (!store) {
      const err = new Error(
        'No store is assigned to your account. Please contact an admin.'
      );
      err.statusCode = 404;
      throw err;
    }

    const { ratings, total } = await ratingRepository.findByStoreId(
      store.id,
      page,
      limit,
      sortBy,
      sortOrder,
      search
    );

    const totalPages = Math.ceil(total / parseInt(limit));

    return {
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        avg_rating: parseFloat(store.avg_rating) || 0,
        rating_count: store.rating_count || 0,
      },
      ratings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
      },
    };
  },
};

module.exports = storeOwnerService;
