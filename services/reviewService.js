//contains bussiness logic
const Review = require("../models/reviewModel");
const factory = require("./handlersFactory");

// Nested Route
// Get  /api/v1/products/:productId/reviews
exports.createFilterObject = (req, res, next) => {
  let filterObj = {};

  if (req.params.productId) filterObj = { product: req.params.productId };
  req.filterObj = filterObj;
  next();
};

//  @desc     Get list of reviews
//  @route    GET  /api/v1/reviews
//  @access   Public

exports.getReviews = factory.getAll(Review);

//  @desc     Get specific Review by id
//  @route    Get /api/v1/Review/:id
//  @access   Public
exports.getReview = factory.getOne(Review);

// Nested Route

exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

//  @desc     Create Review
//  @route    POST  /api/v1/Reviews
//  @access   Private/Protect/User

//wraping it with the asyncHandler to handle the error without using try catch
exports.createReview = factory.createOne(Review);

//  @desc      Update specific Review
//  @route     PUT /api/v1/Reviews/:id
//  @access    Private/Protect/User

exports.updateReview = factory.updateOne(Review);

//  @desc       Delete specific Review
//  @route      DELETE /api/v1/Reviews/:id
// @access      Private/Protect/User-Admin-Manager

exports.deleteReview = factory.deleteOne(Review);
