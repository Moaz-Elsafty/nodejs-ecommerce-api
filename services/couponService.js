const factory = require("./handlersFactory");
const Coupon = require("../models/couponModel");

//  @desc     Get list of coupons
//  @route    GET  /api/v1/coupons
//  @access   Private/Admin-Manager

exports.getCoupons = factory.getAll(Coupon);

//  @desc     Get specific Coupon by id
//  @route    Get /api/v1/coupons/:id
//  @access   Private/Admin-Manager
exports.getCoupon = factory.getOne(Coupon);

//  @desc     Create coupon
//  @route    POST  /api/v1/coupons
//  @access   Private/Admin-Manager

//wraping it with the asyncHandler to handle the error without using try catch
exports.createCoupon = factory.createOne(Coupon);

//  @desc      Update specific coupon
//  @route     PUT /api/v1/coupons/:id
//  @access    Private/Admin-Manager

exports.updateCoupon = factory.updateOne(Coupon);

//  @desc       Delete specific coupon
//  @route      DELETE /api/v1/coupons/:id
// @access      Private/Admin-Manager

exports.deleteCoupon = factory.deleteOne(Coupon);
