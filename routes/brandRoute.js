const express = require("express");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utlis/validators/brandValidator");

const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../services/brandService");

const router = express.Router();

//method 1
// router.get("/", getCategories);
// router.post("/", createBrand);

//method 2
router.route("/").get(getBrands).post(createBrandValidator, createBrand);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
