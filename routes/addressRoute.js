const express = require("express");

const authService = require("../services/authService");

const {
  getLoggedUserAddresses,
  addAddress,
  removeAddress,
} = require("../services/addressService");

const {
  addAddressValidator,
  deleteAddressValidator,
} = require("../utlis/validators/addressesValidator");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router
  .route("/")
  .post(addAddressValidator, addAddress)
  .get(getLoggedUserAddresses);

router.delete("/:addressId", deleteAddressValidator, removeAddress);

module.exports = router;
