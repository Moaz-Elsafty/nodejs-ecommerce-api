//contains bussiness logic
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const multer = require("multer");
const sharp = require("sharp");

const User = require("../models/userModel");
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

exports.uploadUserImage = upload.single("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `User-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      // Hint: take care of the path "/uploads" is different than "uploads"
      .toFile(`uploads/users/${fileName}`);

    req.body.profileImg = fileName;
  }

  next();
});

//  @desc     Get list of Users
//  @route    GET  /api/v1/users
//  @access   Private

exports.getUsers = factory.getAll(User);

//  @desc     Get specific User by id
//  @route    Get /api/v1/users/:id
//  @access   Public
exports.getUser = factory.getOne(User);

//  @desc     Create User
//  @route    POST  /api/v1/users
//  @access   Private

//wraping it with the asyncHandler to handle the error without using try catch
exports.createUser = factory.createOne(User);

//  @desc      Update specific User
//  @route     PUT /api/v1/users/:id
//  @access    Private

exports.updateUser = factory.updateOne(User);

//  @desc       Delete specific User
//  @route      DELETE /api/v1/users/:id
// @access      Private

exports.deleteUser = factory.deleteOne(User);
