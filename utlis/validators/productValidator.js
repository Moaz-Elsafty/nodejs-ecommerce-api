const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),

  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),

  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Too long price"),

  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),

  check("imageCover").notEmpty().withMessage("Product imageCover is required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("images should be an array of string"),

  check("category")
    .notEmpty()
    .withMessage("product must belong to category")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id ${categoryId}`)
          );
        }
      })
    ),

  //error reminder >> whenever I implement custom method I get in postman an Invlaid value error message <<
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    //check if the subCategories have IDS
    .custom((subCategoriesIds) =>
      SubCategory.find({
        _id: { $exists: true, $in: subCategoriesIds },
      }).then((result) => {
        if (result.length < 1 || result.length !== subCategoriesIds.length) {
          return Promise.reject(new Error(`Invalid subcategory Ids`));
        }
      })
    )
    .custom((subCategoriesIdsBody, { req }) =>
      // get all the subCategories that belong to that category from the db
      SubCategory.find({ category: req.body.category }).then(
        (subCategories) => {
          const subCategoriesIdsDB = [];
          subCategories.forEach((subCategory) => {
            subCategoriesIdsDB.push(subCategory._id.toString());
          });
          //check if subcategories ids in body included in subcategories that exist in db
          const checker = (target, arr) =>
            target.every((ids) => arr.includes(ids));

          if (!checker(subCategoriesIdsBody, subCategoriesIdsDB)) {
            return Promise.reject(
              new Error(`subcategories not belong to category`)
            );
          }
        }
      )
    ),

  check("brand").optional().isMongoId().withMessage("Invalid ID format"),

  check("ratingAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),

  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingQuantity must be a number"),

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];
