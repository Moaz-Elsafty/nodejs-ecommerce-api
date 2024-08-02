const express = require("express");

const authService = require("../services/authService");

const {
  addProductToCart,
  getLoggedUserCart,
  removeProductFromCart,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../services/cartService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

router.put("/applyCoupon", applyCoupon);

router
  .route("/:itemId")
  .put(updateCartItemQuantity)
  .delete(removeProductFromCart);

module.exports = router;
