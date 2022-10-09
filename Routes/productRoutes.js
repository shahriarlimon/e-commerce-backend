const express = require('express');
const { getProduct } = require('../Controllers/productController');
const router = express.Router();
router.get('/', getProduct)
module.exports = router;