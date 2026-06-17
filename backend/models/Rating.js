const pool = require('../config/db');

class RatingModel {
  /**
   * Create a new rating.
   * @param {object} data - { user_id, store_id, rating }
   * @returns {object} Created rating row
   */
  static async create(data) {
    const { user_id, store_id, rating } = data;
    const [result] = await pool.execute(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [user_id, store_id, rating]
    );
    return RatingModel.findById(result.insertId);
  }

  /**
   * Update the rating value for an existing rating record.
   * @param {number} id - Rating ID
   * @param {number} rating - New rating value (1–5)
   * @returns {object} Updated rating row
   */
  static async update(id, rating) {
    await pool.execute('UPDATE ratings SET rating = ? WHERE id = ?', [rating, id]);
    return RatingModel.findById(id);
  }

  /**
   * Find a rating by user and store (to check for duplicates or ownership).
   * @param {number} user_id
   * @param {number} store_id
   * @returns {object|null}
   */
  static async findByUserAndStore(user_id, store_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ? LIMIT 1',
      [user_id, store_id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Find a rating by its primary key.
   * @param {number} id
   * @returns {object|null}
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM ratings WHERE id = ? LIMIT 1',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Find all ratings for a specific store with rater user info, paginated.
   * @param {number} store_id
   * @param {number} page
   * @param {number} limit
   * @param {string} sortBy
   * @param {string} sortOrder
   * @param {string} search - Optional search term on user name or email
   * @returns {{ ratings: object[], total: number }}
   */
  static async findByStoreId(
    store_id,
    page = 1,
    limit = 10,
    sortBy = 'r.created_at',
    sortOrder = 'DESC',
    search = ''
  ) {
    const allowedSortColumns = [
      'r.id',
      'r.rating',
      'r.created_at',
      'u.name',
      'u.email',
    ];
    const allowedSortOrders = ['ASC', 'DESC'];

    const safeSort = allowedSortColumns.includes(sortBy) ? sortBy : 'r.created_at';
    const safeOrder = allowedSortOrders.includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : 'DESC';

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [store_id];
    const searchParams = [];

    let searchClause = '';
    if (search) {
      searchClause = 'AND (u.name LIKE ? OR u.email LIKE ?)';
      searchParams.push(`%${search}%`, `%${search}%`);
    }

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM ratings r
      INNER JOIN users u ON u.id = r.user_id
      WHERE r.store_id = ?
      ${searchClause}
    `;
    const [countRows] = await pool.execute(countQuery, [...params, ...searchParams]);
    const total = countRows[0].total;

    const dataQuery = `
      SELECT
        r.id,
        r.user_id,
        r.store_id,
        r.rating,
        r.created_at,
        r.updated_at,
        u.name AS user_name,
        u.email AS user_email
      FROM ratings r
      INNER JOIN users u ON u.id = r.user_id
      WHERE r.store_id = ?
      ${searchClause}
      ORDER BY ${safeSort} ${safeOrder}
      LIMIT ? OFFSET ?
    `;
    const [ratings] = await pool.execute(dataQuery, [
      ...params,
      ...searchParams,
      String(parseInt(limit)),
      String(offset),
    ]);

    return { ratings, total };
  }

  /**
   * Count total number of ratings across all stores.
   * @returns {number}
   */
  static async countAll() {
    const [rows] = await pool.execute('SELECT COUNT(*) AS total FROM ratings');
    return rows[0].total;
  }
}

module.exports = RatingModel;
