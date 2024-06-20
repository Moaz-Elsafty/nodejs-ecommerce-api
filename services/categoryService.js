//contains bussiness logic

//multer is a npm package used to upload files
const multer = require("multer");
//sharp is a npm package used to manipulate the images
const sharp = require("sharp");
//uuid package is used to generate a unique id
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");
const ApiError = require("../utlis/apiError");

// 1- DiskStorage engine
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     //cateogory-${id}-Date.now().jpeg
//     const ext = file.mimetype.split("/")[1];
//     const fileName = `category-${uuidv4()}${Date.now()}.${ext}`;
//     cb(null, fileName);
//   },
// });

// 2- Memory storage enigne
const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only images allowed", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadCategoryImage = upload.single("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${fileName}`);

    // Save image into db
    req.body.image = fileName;
  }

  next();
});

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
//  @access   Private/Admin-Manager

//wraping it with the asyncHandler to handle the error without using try catch
exports.createCategory = factory.createOne(Category);
//  @desc      Update specific category
//  @route     PUT /api/v1/categories/:id
//  @access    Private/Admin-Manager

exports.updateCategory = factory.updateOne(Category);

//  @desc       Delete specific category
//  @route      DELETE /api/v1/categories/:id
// @access      Private/Admin

exports.deleteCategory = factory.deleteOne(Category);
