const StoreModel = require('../models/Store');

/**
 * storeRepository
 * Wraps StoreModel static methods for use in services.
 */
const storeRepository = {
  create: (data) => StoreModel.create(data),

  findAll: (filters, page, limit, sortBy, sortOrder) =>
    StoreModel.findAll(filters, page, limit, sortBy, sortOrder),

  findById: (id) => StoreModel.findById(id),

  findByOwnerId: (owner_id) => StoreModel.findByOwnerId(owner_id),

  getAverageRatingByOwnerId: (owner_id) => StoreModel.getAverageRatingByOwnerId(owner_id),
};

module.exports = storeRepository;
