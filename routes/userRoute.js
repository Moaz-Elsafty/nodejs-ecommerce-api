const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require("../utlis/validators/userValidator");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
} = require("../services/userService");

const router = express.Router();

//method 1
// router.get("/", getCategories);
// router.post("/", createUser);

//method 2
router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, createUserValidator, resizeImage, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
