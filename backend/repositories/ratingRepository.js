const RatingModel = require('../models/Rating');

/**
 * ratingRepository
 * Wraps RatingModel static methods for use in services.
 */
const ratingRepository = {
  create: (data) => RatingModel.create(data),

  update: (id, rating) => RatingModel.update(id, rating),

  findByUserAndStore: (user_id, store_id) => RatingModel.findByUserAndStore(user_id, store_id),

  findById: (id) => RatingModel.findById(id),

  findByStoreId: (store_id, page, limit, sortBy, sortOrder, search) =>
    RatingModel.findByStoreId(store_id, page, limit, sortBy, sortOrder, search),

  countAll: () => RatingModel.countAll(),
};

module.exports = ratingRepository;
