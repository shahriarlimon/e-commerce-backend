const express = require('express');
const { getCategory, newCategory, categoryDelete, saveAttrs } = require('../Controllers/categoryController.js');
const { verifyIsloggedIn, verifyAdmin } = require('../middlewares/verifyTokenAuth.js');
const router = express.Router();
router.get('/', getCategory);
router.use(verifyIsloggedIn)
router.use(verifyAdmin)
router.post("/", newCategory)
router.delete("/:category", categoryDelete);
router.post("/attr", saveAttrs)
module.exports = router;