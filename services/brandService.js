//contains bussiness logic
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const multer = require("multer");
const sharp = require("sharp");

const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");
const ApiError = require("../utlis/apiError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("only images allowed", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadBrandImage = upload.single("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    // Hint: take care of the path "/uploads" is different than "uploads"
    .toFile(`uploads/brands/${fileName}`);

  req.body.image = fileName;

  next();
});

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
