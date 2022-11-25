const express = require('express');
const { getProduct, getProductById, getBestSeller, adminGetProduct, adminDeleteProduct, adminCreateProduct, adminUpdateProduct } = require('../Controllers/productController');
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
router.put("/admin/:id", adminUpdateProduct)
router.post("/admin/create-one", adminCreateProduct)
module.exports = router;