const express = require('express');
const { getProduct } = require('../Controllers/productController');
const router = express.Router();
router.get("/category/:categoryName/search/:searchQuery", getProduct)
router.get("/category/:categoryName", getProduct);
router.get("/search/:searchQuery", getProduct)
router.get('/', getProduct)
module.exports = router;