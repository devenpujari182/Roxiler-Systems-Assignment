const pool = require('../config/db');

class UserModel {
  /**
   * Find a single user by email address.
   * @param {string} email
   * @returns {object|null} User row or null
   */
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Find a single user by their primary key.
   * @param {number} id
   * @returns {object|null} User row (without password) or null
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, address, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Create a new user.
   * @param {object} data - { name, email, password, address, role }
   * @returns {object} Created user (without password)
   */
  static async create(data) {
    const { name, email, password, address = null, role = 'USER' } = data;
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, address, role]
    );
    const insertId = result.insertId;
    return UserModel.findById(insertId);
  }

  /**
   * Update a user's password by ID.
   * @param {number} id
   * @param {string} hashedPassword
   */
  static async updatePassword(id, hashedPassword) {
    await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
  }

  /**
   * Retrieve a paginated, filterable, sortable list of users.
   * Filters supported: name (LIKE), email (LIKE), role (exact)
   * @param {object} filters - { name, email, role }
   * @param {number} page - 1-indexed page number
   * @param {number} limit - Items per page
   * @param {string} sortBy - Column to sort by
   * @param {string} sortOrder - 'ASC' or 'DESC'
   * @returns {{ users: object[], total: number }}
   */
  static async findAll(
    filters = {},
    page = 1,
    limit = 10,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  ) {
    const allowedSortColumns = ['id', 'name', 'email', 'role', 'created_at'];
    const allowedSortOrders = ['ASC', 'DESC'];

    const safeSort = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = allowedSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : 'DESC';

    const conditions = [];
    const params = [];

    if (filters.name) {
      conditions.push('name LIKE ?');
      params.push(`%${filters.name}%`);
    }
    if (filters.email) {
      conditions.push('email LIKE ?');
      params.push(`%${filters.email}%`);
    }
    if (filters.role) {
      conditions.push('role = ?');
      params.push(filters.role);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const countQuery = `SELECT COUNT(*) AS total FROM users ${whereClause}`;
    const [countRows] = await pool.execute(countQuery, params);
    const total = countRows[0].total;

    const dataQuery = `
      SELECT id, name, email, address, role, created_at, updated_at
      FROM users
      ${whereClause}
      ORDER BY ${safeSort} ${safeOrder}
      LIMIT ? OFFSET ?
    `;
    const [users] = await pool.execute(dataQuery, [...params, String(parseInt(limit)), String(offset)]);

    return { users, total };
  }

  /**
   * Return all users with role STORE_OWNER.
   * @returns {object[]}
   */
  static async findAllStoreOwners() {
    const [rows] = await pool.execute(
      "SELECT id, name, email, address, role, created_at FROM users WHERE role = 'STORE_OWNER' ORDER BY name ASC"
    );
    return rows;
  }
}

module.exports = UserModel;
