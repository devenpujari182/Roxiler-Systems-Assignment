const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const pool = require('../config/db');

/**
 * AuthService
 * Handles registration, login, and password management business logic.
 */
const authService = {
  /**
   * Register a new user.
   * - Checks email uniqueness
   * - Hashes password with bcrypt (salt rounds: 10)
   * - Creates user in DB
   * @param {object} data - { name, email, password, address }
   * @returns {object} Created user (without password)
   * @throws {Error} 409 if email already exists
   */
  async register(data) {
    const { name, email, password, address } = data;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const err = new Error('An account with this email address already exists.');
      err.statusCode = 409;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      address: address || null,
      role: 'USER',
    });

    return newUser;
  },

  /**
   * Log in a user.
   * - Finds user by email
   * - Compares bcrypt password
   * - Generates signed JWT
   * @param {string} email
   * @param {string} password
   * @returns {{ token: string, user: object }}
   * @throws {Error} 401 if credentials are invalid
   */
  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });

    const { password: _pw, ...safeUser } = user;

    return {
      token,
      user: safeUser,
    };
  },

  /**
   * Change a user's password.
   * - Fetches full user record (with password) via pool directly
   * - Verifies current password
   * - Hashes new password and updates DB
   * @param {number} userId
   * @param {string} currentPassword
   * @param {string} newPassword
   * @throws {Error} 401 if current password does not match
   */
  async changePassword(userId, currentPassword, newPassword) {
    // Need password field — userRepository.findById omits it
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);
    if (rows.length === 0) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }
    const user = rows[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      const err = new Error('Current password is incorrect.');
      err.statusCode = 401;
      throw err;
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePassword(userId, hashedNew);
  },
};

module.exports = authService;
