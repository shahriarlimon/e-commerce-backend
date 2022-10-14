const express = require('express');
const { getCategory, newCategory, categoryDelete,  saveAttrs } = require('../Controllers/categoryController.js');
const router = express.Router();
router.get('/', getCategory);
router.post("/", newCategory)
router.delete("/:category", categoryDelete);
router.post("/attr", saveAttrs)
module.exports = router;