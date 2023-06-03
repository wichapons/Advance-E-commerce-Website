const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "default category description" },
  imagePath: { type: String, default: "/images/tablets-category.png" },
  attrs: [{ key: { type: String }, value: [{ type: String }] }],
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
