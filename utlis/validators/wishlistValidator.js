const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.addProductToWishlistValidator = [
  check("wishlist").custom(async (val, { req }) => {
    const user = await User.findById(req.user._id);
    // check if product exist in wishlist array
    const list = user.wishlist;
    if (list) {
      const result = list.includes(req.body.productId);

      if (result) {
        return Promise.reject(
          new Error("You already have added the product to the wishlist")
        );
      }
    }
  }),
  validatorMiddleware,
];
