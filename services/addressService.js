const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

//  @desc     Add Address to user addresses list
//  @route    POST  /api/v1/adresses
//  @access   Private/User
exports.addAddress = asyncHandler(async (req, res, next) => {
  // $addToSet >> add address object to user addresses array
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address added successfully",
    data: user.addresses,
  });
});

//  @desc     remove address from user addresses list
//  @route    delete  /api/v1/addresses/:addressId
//  @access   Private/User
exports.removeAddress = asyncHandler(async (req, res, next) => {
  // $pull => remove addtress object from user addresses array
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  // console.log(user.wishlist);

  res.status(200).json({
    status: "success",
    message: "Address removed successfully.",
    data: user.addresses,
  });
});

//  @desc     Get logged user addresses
//  @route    GET  /api/v1/addresses
//  @access   Private/User
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: "success",
    result: user.addresses.length,
    data: user.addresses,
  });
});
