const express = require("express");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utlis/validators/categoryValidator");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");

const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoute);

//method 1
// router.get("/", getCategories);
// router.post("/", createCategory);

//method 2
router
  .route("/")
  .get(getCategories)
  .post(createCategoryValidator, createCategory);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
