const express = require('express');
const { getProduct, getProductById, getBestSeller, adminGetProduct, adminDeleteProduct } = require('../Controllers/productController');
const router = express.Router();
router.get("/category/:categoryName/search/:searchQuery", getProduct)
router.get("/category/:categoryName", getProduct);
router.get("/search/:searchQuery", getProduct)
router.get('/', getProduct);
router.get("/bestsellers", getBestSeller)
router.get('/get-one/:id', getProductById)

/* admin routes */
router.get("/admin", adminGetProduct)
router.delete("/admin/:id", adminDeleteProduct)

module.exports = router;