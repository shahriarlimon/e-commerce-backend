const express = require('express');
const { getUser } = require('../Controllers/userController.js');
const router = express.Router();
router.get('/', getUser)
module.exports = router;