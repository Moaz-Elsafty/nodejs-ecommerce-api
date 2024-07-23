const express = require("express");

const authService = require("../services/authService");

const {
  getLoggedUserWishlist,
  addProductToWishList,
  removeProductFromWishlist,
} = require("../services/wishlistService");

const {
  addProductToWishlistValidator,
} = require("../utlis/validators/wishlistValidator");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router
  .route("/")
  .post(addProductToWishlistValidator, addProductToWishList)
  .get(getLoggedUserWishlist);

router.delete("/:productId", removeProductFromWishlist);

module.exports = router;
