const Product = require("../models/ProductModel");
const recordsPerPage = require("../config/pagination");
const { sendError } = require("../utils/helper");
const { imageValidate } = require("../utils/imageValidate");
exports.getProduct = async (req, res, next) => {
    try {
        let query = {};
        let queryCondition = false;
        let priceQueryCondition = {};

        if (req.query.price) {
            queryCondition = true;
            priceQueryCondition = { price: { $lte: Number(req.query.price) } }
        }
        let ratingQueryCondition = {}
        if (req.query.rating) {
            queryCondition = true;
            ratingQueryCondition = { rating: { $in: Number(req.query.rating.split(",")) } }
        };
        let categoryQueryCondition = {};
        /* from search bar */
        const categoryName = req.params.categoryName || "";
        if (categoryName) {
            queryCondition = true;
            let a = categoryName.replaceAll(",", "/");
            var regEx = new RegExp("^" + a);
            categoryQueryCondition = { category: regEx };
        }
        /* from filter page */
        if (req.query.category) {
            queryCondition = true;
            let a = req.query.category.split(",").map((item) => {
                if (item) return new RegExp("^" + item)
            })
            categoryQueryCondition = {
                category: {
                    $in: a
                }
            }
        }
        let attrsQueryCondition = [];
        if (req.query.attrs) {
            attrsQueryCondition = req.query.attrs.split(",").reduce((acc, item) => {
                if (item) {
                    let a = item.split("-");
                    let values = [...a];
                    values.shift();
                    let a1 = {
                        attrs: { $elemMatch: { key: a[0], value: { $in: values } } }
                    }
                    acc.push(a1);
                    return acc;
                } else return acc;
            }, [])

        }
        /*  pagination */
        const pageNum = Number(req.params.pageNum) || 1;

        /* sort by name,price  */
        let sort = {};
        const sortOption = req.query.sort || "";
        if (sortOption) {
            let sortOpt = sortOption.split("_");
            sort = { [sortOpt[0]]: Number(sortOpt[1]) }
        }
        /* Search query */
        const searchQuery = req.params.searchQuery || "";
        let searchQueryCondition = {};
        if (searchQuery) {
            queryCondition = true;
            searchQueryCondition = { $text: { $search: '"' + searchQuery + '"' } }
            select = {

            }
            sort = {
                score: { $meta: "textScore" }
            }
        }

        if (queryCondition) {
            query = {
                $and: [priceQueryCondition, ratingQueryCondition, categoryQueryCondition, searchQueryCondition, ...attrsQueryCondition]
            }
        }



        const totalProduct = await Product.countDocuments(query);
        const products = await Product.find(query).skip(recordsPerPage * (pageNum - 1)).sort(sort).limit(recordsPerPage)
        res.json({ products, pageNum, paginationLinksNumber: Math.ceil(totalProduct / recordsPerPage) })

    } catch (error) {
        next(error)
    }
}

exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate("reviews").orFail();
        res.json(product)
    } catch (error) {
        next(error)
    }
}

exports.getBestSeller = async (req, res, next) => {
    try {
        const products = await Product.aggregate([
            { $sort: { category: 1, sales: -1 } },
            { $group: { _id: "$category", doc_with_max_sales: { $first: "$$ROOT" } } },
            { $replaceWith: "$doc_with_max_sales" },
            { $match: { sales: { $gt: 0 } } },
            { $project: { _id: 1, name: 1, images: 1, category: 1, description: 1 } },
            { $limit: 3 }
        ])
        res.json(products)
    } catch (error) {
        next(error)
    }
}


exports.adminGetProduct = async (req, res, next) => {
    try {
        const products = await Product.find({}).sort({ category: 1 }).select("name price category")
        res.json(products)
    } catch (error) {
        next(error)
    }
}
exports.adminDeleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).orFail();
        await product.remove();
        res.json({ message: "Product removed" })
    } catch (error) {
        next(error)
    }
}

exports.adminCreateProduct = async (req, res, next) => {
    try {
        const product = new Product()
        const { name, description, count, price, category, attributesTable } = req.body;
        product.name = name;
        product.description = description;
        product.count = count;
        product.price = price;
        product.category = category;
        if (attributesTable > 0) {
            attributesTable.map((item) => {
                product.attrs.push(item)
            })
        }
        await product.save();
        res.json({
            message: "Product created",
            productId: product._id
        })

    } catch (error) {
        next(error)
    }
}

exports.adminUpdateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        const { name, category, description, price, count, attributesTable } = req.body;
        product.name = name || product.name;
        product.category = category || product.category;
        product.description = description || product.description;
        if (attributesTable.length > 0) {
            product.attrs = [];
            attributesTable.map((item) => {
                product.attrs.push(item)
            })
        } else {
            product.attrs = []
        }
        await product.save();
        res.json({ message: "Product updated successfully" })
    } catch (error) {
        next(error)
    }
}

exports.adminFileUpload = async (req, res, next) => {
    try {
        if (!req.files || !!req.files.images === false) {
            return res.status(400).send("No files were uploaded")

        }
        const validateResult = imageValidate(req.files.images);
        if (validateResult.error) sendError(res, validateResult.error, 400)
        const path = require("path");
        const { v4: uuidv4 } = require('uuid');
        const uploadDirectory = path.resolve(__dirname, "../../frontend", "public", "images", "products")
        let imagesTable = [];
        let product = await Product.findById(req.query.productId).orFail();

        if (Array.isArray(req.files.images)) {
            imagesTable = req.files.images
        } else {
            imagesTable.push(req.files.images)
        }
        for (let image of imagesTable) {
            var fileName = uuidv4() + path.extname(image.name)
            var uploadPath = uploadDirectory + "/" + fileName;
            product.images.push({ path: "/images/products/" + fileName })
            image.mv(uploadPath, function (err) {
                if (err) {
                    return res.status(500).send(err)
                }
            })
            await product.save()
            res.json({ message: "Files uploaded" })

        }
    } catch (error) {
        next(error)
    }
}

exports.adminDeleteProductImage = async (req, res, next) => {
    try {
        const imagePath = decodeURIComponent(req.params.imagePath);
        const path = require("path")
        const finalPath = path.resolve("../frontend/public") + imagePath;
        const fs = require("fs")
        fs.unlink(finalPath, (err) => {
            if (err) { res.status(500).send(err) }
        })
        return res.end()
    } catch (error) {
        next(error)
    }
}