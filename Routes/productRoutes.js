const express = require('express');
const { getProduct, getProductById, getBestSeller, adminGetProduct, adminDeleteProduct, adminCreateProduct, adminUpdateProduct, adminFileUpload } = require('../Controllers/productController');
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
router.delete("/admin/image/:imagePath/:productId", adminDeleteProduct)
router.post("/admin/create-one", adminCreateProduct)
router.post("/admin/upload", adminFileUpload)
module.exports = router;