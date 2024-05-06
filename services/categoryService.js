//contains bussiness logic
const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");

//  @desc     Get list of categories
//  @route    GET  /api/v1/categories
//  @access   Public

exports.getCategories = factory.getAll(Category);

//  @desc     Get specific category by id
//  @route    Get /api/v1/categories/:id
//  @access   Public
exports.getCategory = factory.getOne(Category);
//  @desc     Create category
//  @route    POST  /api/v1/cateogries
//  @access   Private

//wraping it with the asyncHandler to handle the error without using try catch
exports.createCategory = factory.createOne(Category);
//  @desc      Update specific category
//  @route     PUT /api/v1/categories/:id
//  @access     Private

exports.updateCategory = factory.updateOne(Category);

//  @desc       Delete specific category
//  @route      DELETE /api/v1/categories/:id
// @access      Private

exports.deleteCategory = factory.deleteOne(Category);
