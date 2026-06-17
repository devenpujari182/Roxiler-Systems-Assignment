const pool = require('../config/db');

class StoreModel {
  /**
   * Create a new store.
   * @param {object} data - { name, email, address, owner_id }
   * @returns {object} Created store
   */
  static async create(data) {
    const { name, email = null, address = null, owner_id = null } = data;
    const [result] = await pool.execute(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id]
    );
    return StoreModel.findById(result.insertId);
  }

  /**
   * Retrieve a paginated, filterable, sortable list of stores with average rating.
   * Filters supported: name (LIKE), email (LIKE), address (LIKE)
   * @param {object} filters - { name, email, address }
   * @param {number} page
   * @param {number} limit
   * @param {string} sortBy
   * @param {string} sortOrder
   * @returns {{ stores: object[], total: number }}
   */
  static async findAll(
    filters = {},
    page = 1,
    limit = 10,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  ) {
    const allowedSortColumns = ['id', 'name', 'email', 'address', 'avg_rating', 'created_at'];
    const allowedSortOrders = ['ASC', 'DESC'];

    const safeSort = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = allowedSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : 'DESC';

    const conditions = [];
    const params = [];

    if (filters.name) {
      conditions.push('s.name LIKE ?');
      params.push(`%${filters.name}%`);
    }
    if (filters.email) {
      conditions.push('s.email LIKE ?');
      params.push(`%${filters.email}%`);
    }
    if (filters.address) {
      conditions.push('s.address LIKE ?');
      params.push(`%${filters.address}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM stores s
      ${whereClause}
    `;
    const [countRows] = await pool.execute(countQuery, params);
    const total = countRows[0].total;

    const dataQuery = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        s.created_at,
        s.updated_at,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        COUNT(r.id) AS rating_count,
        u.name AS owner_name
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      LEFT JOIN users u ON u.id = s.owner_id
      ${whereClause}
      GROUP BY s.id
      ORDER BY ${safeSort} ${safeOrder}
      LIMIT ? OFFSET ?
    `;
    const [stores] = await pool.execute(dataQuery, [
      ...params,
      String(parseInt(limit)),
      String(offset),
    ]);

    return { stores, total };
  }

  /**
   * Find a store by ID, including average rating.
   * @param {number} id
   * @returns {object|null}
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT
         s.id,
         s.name,
         s.email,
         s.address,
         s.owner_id,
         s.created_at,
         s.updated_at,
         COALESCE(AVG(r.rating), 0) AS avg_rating,
         COUNT(r.id) AS rating_count,
         u.name AS owner_name
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       LEFT JOIN users u ON u.id = s.owner_id
       WHERE s.id = ?
       GROUP BY s.id
       LIMIT 1`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Find the store owned by a given user.
   * @param {number} owner_id
   * @returns {object|null}
   */
  static async findByOwnerId(owner_id) {
    const [rows] = await pool.execute(
      `SELECT
         s.id,
         s.name,
         s.email,
         s.address,
         s.owner_id,
         s.created_at,
         s.updated_at,
         COALESCE(AVG(r.rating), 0) AS avg_rating,
         COUNT(r.id) AS rating_count
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.owner_id = ?
       GROUP BY s.id
       LIMIT 1`,
      [owner_id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Get the average rating for all stores owned by a given owner.
   * @param {number} owner_id
   * @returns {number} Average rating (0 if no ratings)
   */
  static async getAverageRatingByOwnerId(owner_id) {
    const [rows] = await pool.execute(
      `SELECT COALESCE(AVG(r.rating), 0) AS avg_rating
       FROM ratings r
       INNER JOIN stores s ON s.id = r.store_id
       WHERE s.owner_id = ?`,
      [owner_id]
    );
    return parseFloat(rows[0].avg_rating) || 0;
  }
}

module.exports = StoreModel;
