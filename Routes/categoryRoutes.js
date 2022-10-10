const express = require('express');
const { getCategory } = require('../Controllers/categoryController.js');
const router = express.Router();
router.get('/', getCategory)
module.exports = router;