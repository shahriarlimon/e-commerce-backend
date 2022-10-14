const { set } = require("mongoose");
const Category = require("../models/CategoryModel");
const { sendError } = require("../utils/helper");

exports.getCategory = async (req, res, next) => {
    try {
        const categories = await Category.find({}).sort({ name: 'asc' }).orFail();
        res.send(categories)
    } catch (error) {
        next(error)
    }

}
exports.newCategory = async (req, res, next) => {
    try {
        const { category } = req.body;
        if (!category) sendError(res, "Category input is required!", 400);
        const categoryExists = await Category.findOne({ name: category });
        if (categoryExists) sendError(res, "Category already exists", 400);
        const categoryCreated = await Category.create({ name: category });
        res.status(201).send({ categoryCreated })




    } catch (error) {
        next(error.message)
    }
}
exports.categoryDelete = async (req, res, next) => {
    try {
        const { category } = req.params;
        if (category !== "Choose category") {
            const categoryExists = await Category.findOne({ name: decodeURIComponent(category) }).orFail();
            await categoryExists.remove();
            res.json({ categoryDeleted: true })
        }

    } catch (error) {
        next(error.message)

    }
}

exports.saveAttrs = async (req, res, next) => {
    const { key, val, categoryChoosen } = req.body;
    if (!key || !val || !categoryChoosen) sendError(res, "All inputs are required!", 400)
    try {
        const category = await categoryChoosen.split("/")[0];
        const categoryExists = await Category.findOne({ name: category }).orFail();
        if (categoryExists.attrs.length > 0) {
            var keyDoesNotExistInDatabase = true;
            categoryExists.attrs.map((item, idx) => {
                if (item.key === key) {
                    keyDoesNotExistInDatabase = false;
                    var copyAttributeValues = [...categoryExists.attrs[idx].value];
                    copyAttributeValues.push(val);
                    var newAttributeValues = [...new Set(copyAttributeValues)];
                    categoryExists.attrs[idx].value = newAttributeValues;

                }
            })

        } else {
            categoryExists.attrs.push({ key: key, value: [val] })
        }
        await categoryExists.save();
        const cat = await Category.find({}).sort({ name: "asc" })
        return res.status(200).json({ categoriesUpdated: cat })


    } catch (error) {
        next(error.message)

    }
}