const adminService = require('../services/adminService');
const { success } = require('../utils/responseHelper');

/**
 * AdminController
 * Handles HTTP layer for admin-only endpoints.
 */
const adminController = {
  /**
   * GET /api/admin/dashboard
   * Returns platform-wide statistics: total users, stores, and ratings.
   */
  async getDashboard(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      return success(res, stats, 'Dashboard statistics retrieved successfully.');
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/admin/users
   * Admin creates a new user with any role.
   */
  async addUser(req, res, next) {
    try {
      const { name, email, password, address, role } = req.body;
      const user = await adminService.addUser({ name, email, password, address, role });
      return success(res, { user }, 'User created successfully.', 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/admin/users
   * Paginated, filterable, sortable list of all users.
   * Query params: name, email, role, page, limit, sortBy, sortOrder
   */
  async getUsers(req, res, next) {
    try {
      const {
        name,
        email,
        role,
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        sortOrder = 'DESC',
      } = req.query;

      const filters = {};
      if (name) filters.name = name;
      if (email) filters.email = email;
      if (role) filters.role = role;

      const result = await adminService.getUsers(
        filters,
        parseInt(page),
        parseInt(limit),
        sortBy,
        sortOrder
      );

      return success(res, result, 'Users retrieved successfully.');
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/admin/users/:id
   * Get a single user by ID. STORE_OWNERs also get their store's avg rating.
   */
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await adminService.getUserById(parseInt(id));
      return success(res, { user }, 'User retrieved successfully.');
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/admin/stores
   * Admin creates a new store.
   */
  async addStore(req, res, next) {
    try {
      const { name, email, address, owner_id } = req.body;
      const store = await adminService.addStore({ name, email, address, owner_id });
      return success(res, { store }, 'Store created successfully.', 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/admin/stores
   * Paginated, filterable, sortable list of all stores with avg_rating.
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

      const result = await adminService.getStores(
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

module.exports = adminController;
