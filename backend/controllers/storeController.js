const storeService = require('../services/storeService');
const { success } = require('../utils/responseHelper');

/**
 * StoreController
 * Handles HTTP layer for store browsing by authenticated regular users.
 */
const storeController = {
  /**
   * GET /api/stores
   * Returns paginated list of stores with avg_rating and the requesting user's own rating.
   * Query params: name, email, address, page, limit, sortBy, sortOrder
   */
  async getStores(req, res, next) {
    try {
      const {
        name,
        email,
        address,
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        sortOrder = 'DESC',
      } = req.query;

      const filters = {};
      if (name) filters.name = name;
      if (email) filters.email = email;
      if (address) filters.address = address;

      const userId = req.user.id;

      const result = await storeService.getStores(
        userId,
        filters,
        parseInt(page),
        parseInt(limit),
        sortBy,
        sortOrder
      );

      return success(res, result, 'Stores retrieved successfully.');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = storeController;
