//contains bussiness logic
const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

//middleware for attaching categoryId to the body when creating new subCategory
//Nested route (Create)
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
//  @desc     Create subCategory
//  @route    POST  /api/v1/subCateogries
//  @access   Private

exports.createSubCategory = factory.createOne(SubCategory);

// Middleware for filtering the get request before the main get request
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;

  next();
};
//  @desc     Get list of subCategories
//  @route    GET  /api/v1/subCategories
//  @access   Public

exports.getSubCategories = factory.getAll(SubCategory);

//  @desc     Get specific subCategory by id
//  @route    Get /api/v1/subcategories/:id
//  @access   Public
exports.getSubCategory = factory.getOne(SubCategory);

//  @desc     Update specific subCategory by id
//  @route    Update /api/v1/subcategories/:id
//  @access   Private

exports.updateSubCategory = factory.updateOne(SubCategory);

//  @desc       Delete specific subCategory
//  @route      DELETE /api/v1/subcategories/:id
// @access      Private

exports.deleteSubCategory = factory.deleteOne(SubCategory);
