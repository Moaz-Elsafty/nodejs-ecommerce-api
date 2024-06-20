//contains bussiness logic
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const multer = require("multer");
const sharp = require("sharp");

const User = require("../models/userModel");
const factory = require("./handlersFactory");
const ApiError = require("../utlis/apiError");
const generateToken = require("../utlis/createToken");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("only images allowed", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserImage = upload.single("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  // console.log(req.file);
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
//  @access   Private/Admin

exports.getUsers = factory.getAll(User);

//  @desc     Get specific User by id
//  @route    Get /api/v1/users/:id
//  @access   Private/Admin
exports.getUser = factory.getOne(User);

//  @desc     Create User
//  @route    POST  /api/v1/users
//  @access   Private/Admin

//wraping it with the asyncHandler to handle the error without using try catch
exports.createUser = factory.createOne(User);

//  @desc      Update specific User
//  @route     PUT /api/v1/users/:id
//  @access    Private/Admin

exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
      active: req.body.active,
    },
    {
      new: true,
    }
  );

  if (!document) {
    // res.status(404).json({ message: `No brand for this id ${id}` });
    return next(new ApiError(`No data for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

//  @desc       Delete specific User
//  @route      DELETE /api/v1/users/:id
//  @access     Private/Admin
exports.deleteUser = factory.deleteOne(User);

//  @desc     Get Logged user data
//  @route    Get /api/v1/users/getMe
//  @access   Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

//  @desc     Update Logged user data
//  @route    PUT /api/v1/users/updateMe
//  @access   Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ data: updateUser });
});

//  @desc     Update Logged user password
//  @route    PUT /api/v1/users/updatePass
//  @access   Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) update user password based on user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  // 2) Generate new token
  const token = generateToken(user.id);
  res.status(200).json({ data: user, token });
});

//  @desc     Deactivate logged user
//  @route    Delete /api/v1/users/deleteMe
//  @access   Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: "Success" });
});
