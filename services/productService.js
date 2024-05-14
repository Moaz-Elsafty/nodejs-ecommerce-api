const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const Product = require("../models/productModel");
const factory = require("./handlersFactory");
const ApiError = require("../utlis/apiError");

// Using multer package to enable the feature of uploading files
const multerStorage = multer.memoryStorage();

// >>> validation layer to ensure that the data uploaded is img << not working !!

// const multerFilter = function (req, file, cb) {
//   const files = [file];
//   if (files) {
//     console.log(files[0]);
//     cb(null, true);
//   } else {
//     cb(new ApiError("Only images allowed", 400), false);
//   }
// };

const upload = multer({ storage: multerStorage });

exports.uploadProductImages = upload.fields([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  if (req.files.imageCover) {
    // 1- Image processing for imageCover
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }

  // 2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    // wrapping the function into Promise to wait until it is executed then go to next()
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );
  }

  next();
});
//  @desc     Get list of products
//  @route    GET  /api/v1/products
//  @access   Public

exports.getProducts = factory.getAll(Product, "Products");

//  @desc     Get specific product by id
//  @route    Get /api/v1/products/:id
//  @access   Public
exports.getProduct = factory.getOne(Product);

//  @desc     Create product
//  @route    POST  /api/v1/products
//  @access   Private

//wraping it with the asyncHandler to handle the error without using try catch
exports.createProduct = factory.createOne(Product);

//  @desc      Update specific product
//  @route     PUT /api/v1/categories/:id
//  @access     Private

exports.updateProduct = factory.updateOne(Product);

//  @desc       Delete specific product
//  @route      DELETE /api/v1/categories/:id
// @access      Private

exports.deleteProduct = factory.deleteOne(Product);
