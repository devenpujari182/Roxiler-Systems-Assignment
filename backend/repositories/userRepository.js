const UserModel = require('../models/User');

/**
 * userRepository
 * Wraps UserModel static methods for use in services.
 * Provides a clean abstraction layer between services and data access.
 */
const userRepository = {
  findByEmail: (email) => UserModel.findByEmail(email),

  findById: (id) => UserModel.findById(id),

  create: (data) => UserModel.create(data),

  updatePassword: (id, hashedPassword) => UserModel.updatePassword(id, hashedPassword),

  findAll: (filters, page, limit, sortBy, sortOrder) =>
    UserModel.findAll(filters, page, limit, sortBy, sortOrder),

  findAllStoreOwners: () => UserModel.findAllStoreOwners(),
};

module.exports = userRepository;
