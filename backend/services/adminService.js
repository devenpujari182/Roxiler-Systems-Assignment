const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const storeRepository = require('../repositories/storeRepository');
const ratingRepository = require('../repositories/ratingRepository');
const pool = require('../config/db');

/**
 * AdminService
 * Business logic for admin-only operations.
 */
const adminService = {
  /**
   * Get platform-wide dashboard statistics.
   * @returns {{ totalUsers: number, totalStores: number, totalRatings: number }}
   */
  async getDashboardStats() {
    const [usersCount] = await pool.execute('SELECT COUNT(*) AS total FROM users');
    const [storesCount] = await pool.execute('SELECT COUNT(*) AS total FROM stores');
    const totalRatings = await ratingRepository.countAll();

    return {
      totalUsers: usersCount[0].total,
      totalStores: storesCount[0].total,
      totalRatings,
    };
  },

  /**
   * Admin creates a new user (any role).
   * @param {object} data - { name, email, password, address, role }
   * @returns {object} Created user without password
   * @throws {Error} 409 if email already taken
   */
  async addUser(data) {
    const { name, email, password, address, role } = data;

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      const err = new Error('A user with this email already exists.');
      err.statusCode = 409;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      address: address || null,
      role,
    });

    return newUser;
  },

  /**
   * Admin creates a new store.
   * If owner_id is provided, validates that the referenced user has STORE_OWNER role.
   * @param {object} data - { name, email, address, owner_id }
   * @returns {object} Created store
   * @throws {Error} 400 if owner_id doesn't reference a STORE_OWNER
   */
  async addStore(data) {
    const { name, email, address, owner_id } = data;

    if (owner_id) {
      const owner = await userRepository.findById(owner_id);
      if (!owner) {
        const err = new Error(`User with id ${owner_id} does not exist.`);
        err.statusCode = 400;
        throw err;
      }
      if (owner.role !== 'STORE_OWNER') {
        const err = new Error(
          `User with id ${owner_id} does not have the STORE_OWNER role. Assign the STORE_OWNER role first.`
        );
        err.statusCode = 400;
        throw err;
      }
    }

    const newStore = await storeRepository.create({
      name,
      email: email || null,
      address: address || null,
      owner_id: owner_id || null,
    });

    return newStore;
  },

  /**
   * Get paginated, filterable list of users.
   * @param {object} filters
   * @param {number} page
   * @param {number} limit
   * @param {string} sortBy
   * @param {string} sortOrder
   * @returns {{ users: object[], total: number, page: number, limit: number, totalPages: number }}
   */
  async getUsers(filters = {}, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC') {
    const { users, total } = await userRepository.findAll(filters, page, limit, sortBy, sortOrder);
    const totalPages = Math.ceil(total / limit);
    return { users, total, page: parseInt(page), limit: parseInt(limit), totalPages };
  },

  /**
   * Get a single user by ID.
   * If the user is a STORE_OWNER, also includes their store's average rating.
   * @param {number} id
   * @returns {object} User + optional store/rating info
   * @throws {Error} 404 if not found
   */
  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }

    const result = { ...user };

    if (user.role === 'STORE_OWNER') {
      const store = await storeRepository.findByOwnerId(id);
      result.store = store || null;
      result.avg_store_rating = store ? parseFloat(store.avg_rating) : null;
    }

    return result;
  },

  /**
   * Get paginated, filterable list of stores.
   * @param {object} filters
   * @param {number} page
   * @param {number} limit
   * @param {string} sortBy
   * @param {string} sortOrder
   * @returns {{ stores: object[], total: number, page: number, limit: number, totalPages: number }}
   */
  async getStores(filters = {}, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC') {
    const { stores, total } = await storeRepository.findAll(filters, page, limit, sortBy, sortOrder);
    const totalPages = Math.ceil(total / limit);
    return { stores, total, page: parseInt(page), limit: parseInt(limit), totalPages };
  },
};

module.exports = adminService;
