const express = require("express");
const {
  signUpValidator,
  logInValidator,
} = require("../utlis/validators/authValidator");

const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

router.post("/signup", signUpValidator, signup);
router.post("/login", logInValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyPassResetCode);
router.put("/resetPassword", resetPassword);

module.exports = router;
