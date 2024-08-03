const express = require("express");
const {
  createCashOrder,
  filterOrderForLoggedUser,
  findAllOrders,
  findSpecificOrder,
  updateOrderToPaid,
  updateOrderToDeliverd,
  checkoutSession,
} = require("../services/orderService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router.get(
  "/checkout-session/:cartId",
  authService.allowedTo("user"),
  checkoutSession
);

router.post("/:cartId", authService.allowedTo("user"), createCashOrder);
router.put(
  "/:id/pay",
  authService.allowedTo("admin", "manager"),
  updateOrderToPaid
);
router.put(
  "/:id/deliver",
  authService.allowedTo("admin", "manager"),
  updateOrderToDeliverd
);
router.get(
  "/",
  authService.allowedTo("admin", "manager", "user"),
  filterOrderForLoggedUser,
  findAllOrders
);
router.get("/:id", findSpecificOrder);

module.exports = router;
