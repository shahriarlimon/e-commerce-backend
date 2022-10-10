const express = require('express');
const { getOrder } = require('../Controllers/orderController.js');
const router = express.Router();
router.get('/', getOrder)
module.exports = router;