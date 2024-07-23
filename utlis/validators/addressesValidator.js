const { check, body } = require("express-validator");
const User = require("../../models/userModel");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.addAddressValidator = [
  check("alias")
    .notEmpty()
    .withMessage("You must add an alias to your address")
    .isLength({ min: 2 })
    .withMessage("Alias length must be greater than 2")
    .isLength({ max: 15 })
    .withMessage("Alias length must be smaller than 15")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id);
      // Check if there is an address with the same alias
      const list = user.addresses;

      const result = list.some((element) => element.alias === val);

      if (result) {
        return Promise.reject(
          new Error("You have an address with the same alias")
        );
      }
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accept EGY and SAU phone numbers"),
  check("postalCode").optional().isPostalCode("any"),
  validatorMiddleware,
];

exports.deleteAddressValidator = [
  check("addressId").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];
