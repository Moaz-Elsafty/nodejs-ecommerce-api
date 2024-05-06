//contains bussiness logic
const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");

//  @desc     Get list of brands
//  @route    GET  /api/v1/brands
//  @access   Public

exports.getBrands = factory.getAll(Brand);

//  @desc     Get specific Brand by id
//  @route    Get /api/v1/brand/:id
//  @access   Public
exports.getBrand = factory.getOne(Brand);

//  @desc     Create brand
//  @route    POST  /api/v1/brands
//  @access   Private

//wraping it with the asyncHandler to handle the error without using try catch
exports.createBrand = factory.createOne(Brand);

//  @desc      Update specific brand
//  @route     PUT /api/v1/brands/:id
//  @access     Private

exports.updateBrand = factory.updateOne(Brand);

//  @desc       Delete specific brand
//  @route      DELETE /api/v1/brands/:id
// @access      Private

exports.deleteBrand = factory.deleteOne(Brand);
