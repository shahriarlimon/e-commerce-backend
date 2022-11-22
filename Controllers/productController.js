const Product = require("../models/ProductModel");
const recordsPerPage = require("../config/pagination")
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