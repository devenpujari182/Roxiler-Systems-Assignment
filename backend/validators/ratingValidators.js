const { body } = require('express-validator');

/**
 * submitRatingValidation
 * Validates the initial rating submission:
 * - store_id: required, positive integer
 * - rating: required, integer between 1 and 5
 */
const submitRatingValidation = [
  body('store_id')
    .notEmpty()
    .withMessage('store_id is required.')
    .isInt({ min: 1 })
    .withMessage('store_id must be a positive integer.')
    .toInt(),

  body('rating')
    .notEmpty()
    .withMessage('Rating is required.')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5.')
    .toInt(),
];

/**
 * updateRatingValidation
 * Validates rating update (only the rating value, store/user are from route/token):
 * - rating: required, integer between 1 and 5
 */
const updateRatingValidation = [
  body('rating')
    .notEmpty()
    .withMessage('Rating is required.')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5.')
    .toInt(),
];

module.exports = {
  submitRatingValidation,
  updateRatingValidation,
};
