const express = require('express');
const { getUser, registerUser } = require('../Controllers/userController.js');
const router = express.Router();
router.get('/', getUser)
router.post('/register', registerUser)
module.exports = router;