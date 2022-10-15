const Product = require("../models/ProductModel");
const recordsPerPage = require("../config/pagination")
exports.getProduct = async (req, res, next) => {
    try {
        const pageNum = Number(req.params.pageNum) || 1;
        const totalProduct = await Product.countDocuments({});
        /* sort by name,price  */
        let sort = {};
        const sortOption = req.query.sort || "";
        if (sortOption) {
            let sortOpt = sortOption.split("_");
            sort = { [sortOpt[0]]: Number(sortOpt[1]) }
        }
        const products = await Product.find({}).skip(recordsPerPage * (pageNum - 1)).sort(sort).limit(recordsPerPage)
        res.json({ products, pageNum, paginationLinksNumber: Math.ceil(totalProduct / recordsPerPage) })

    } catch (error) {
        next(error)
    }
}