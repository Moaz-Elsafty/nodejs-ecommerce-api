const crypto = require("crypto");

// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require("jsonwebtoken");
const bcrybt = require("bcryptjs");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utlis/apiError");
const sendEmail = require("../utlis/sendEmail");
const generateToken = require("../utlis/createToken");
const {
  sanitizeSingnUpUser,
  sanitizeLogInUser,
} = require("../utlis/sanitizeData");

const User = require("../models/userModel");

//  @desc     Signup
//  @route    GET  /api/v1/auth/signup
//  @access   Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // 2- Generate token
  const token = generateToken(user._id);

  res.status(201).json({ data: sanitizeSingnUpUser(user), token });
});

//  @desc     Login
//  @route    GET  /api/v1/auth/login
//  @access   Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  const user = await User.findOne({ email: req.body.email });

  // 2) check if user exist & check if password is correct
  if (!user || !(await bcrybt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  // 3) generate token
  const token = generateToken(user._id);

  // 4) send response to client side
  res.status(200).json({ data: sanitizeLogInUser(user), token });
});

// @desc make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) check if token exist, if exist get it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token || token === "null") {
    return next(
      new ApiError(
        "You are not login, Please login to get access to this route",
        401
      )
    );
  }

  // 2) verfiy token (no change happens, expired token) and handle it in the error middleware
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belongs to this token does no longer exist",
        401
      )
    );
  }

  // 4) check if user change his password after token has been created
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passwordChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed the password. please login again..",
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
});

// @desc    Authorization (User Permissions)
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

//  @desc     Forgot Password
//  @route    Post  /api/v1/auth/forgotPassword
//  @access   Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user for this email ${req.body.email}`, 404)
    );
  }

  // 2) If user exist, generate hash random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerfied = false;

  await user.save();

  // 3) Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to compelete the reset.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 mins)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerfied = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to your email" });
});

//  @desc     Verfiy Reset Password Code
//  @route    Post  /api/v1/auth/verifyResetCode
//  @access   Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }
  // 2) Reset code valid
  user.passwordResetVerfied = true;
  await user.save();

  res.status(200).json({ status: "Success" });
});

//  @desc     Reset Password
//  @route    Post  /api/v1/auth/resetPassword
//  @access   Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with this email ${req.body.email}`, 404)
    );
  }
  // 2) Check if reset code is verified
  if (!user.passwordResetVerfied) {
    return next(new ApiError("Reset code not verfied", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerfied = undefined;

  await user.save();

  // 3) If everything is ok, then generate token
  const token = generateToken(user._id);
  res.status(200).json({ token });
});
