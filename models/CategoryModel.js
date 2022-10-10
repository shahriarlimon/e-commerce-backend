const mongoose = require('mongoose');
const categorySchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "Default category description" },
    image: { type: String, default: "/images/tablets-category.png" },
    attrs: [{ key: { type: String }, value: [{ type: String }] }]
})
const Category = mongoose.model("Category", categorySchema);
categorySchema.index({ description: 1 })
module.exports = Category