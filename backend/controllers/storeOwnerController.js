const storeOwnerService = require('../services/storeOwnerService');
const { success } = require('../utils/responseHelper');

/**
 * StoreOwnerController
 * Handles HTTP layer for store owner dashboard endpoint.
 */
const storeOwnerController = {
  /**
   * GET /api/store-owner/dashboard
   * Returns the owner's store info, avg rating, and paginated list of raters.
   * Query params: page, limit, sortBy, sortOrder, search
   */
  async getDashboard(req, res, next) {
    try {
      const ownerId = req.user.id;
      const {
        page = 1,
        limit = 10,
        sortBy = 'r.created_at',
        sortOrder = 'DESC',
        search = '',
      } = req.query;

      const data = await storeOwnerService.getDashboard(ownerId, {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
        search,
      });

      return success(res, data, 'Store owner dashboard retrieved successfully.');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = storeOwnerController;
