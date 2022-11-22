const express = require('express');
const { getProduct, getProductById, getBestSeller } = require('../Controllers/productController');
const router = express.Router();
router.get("/category/:categoryName/search/:searchQuery", getProduct)
router.get("/category/:categoryName", getProduct);
router.get("/search/:searchQuery", getProduct)
router.get('/', getProduct);
router.get("/bestsellers", getBestSeller)
router.get('/:id', getProductById)

module.exports = router;