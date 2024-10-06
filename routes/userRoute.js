const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utlis/validators/userValidator");

const authService = require("../services/authService");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserData,
  updateLoggedUserPassword,
  deleteLoggedUserData,
} = require("../services/userService");

const router = express.Router();

router.use(authService.protect);

// User
router.get("/getMe", getLoggedUserData, getUser);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.put("/updatePass", updateUserValidator, updateLoggedUserPassword);
router.delete("/deleteMe", deleteLoggedUserData);

// Admin
router.use(authService.allowedTo("admin"));
router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, createUserValidator, resizeImage, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router.put(
  "/changePassword/:id",
  updateUserPasswordValidator,
  changeUserPassword
);

module.exports = router;
