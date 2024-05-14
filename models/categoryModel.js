const mongoose = require("mongoose");

// 1. Create Schema
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    //A and B => shoping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    parent: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

CategorySchema.post("init", (doc) => {
  setImageUrl(doc);
});

CategorySchema.post("save", (doc) => {
  setImageUrl(doc);
});

// 2. create Model
// const categoryModel = mongoose.model("Category", CategorySchema);

module.exports = mongoose.model("Category", CategorySchema);
