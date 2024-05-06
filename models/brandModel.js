const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: [true, "brand must be unique"],
      minlength: [2, "Too short Brand name"],
      maxlength: [32, "Too long Brand name"],
    },
    // A and B => shopping.com/A-and-B
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
