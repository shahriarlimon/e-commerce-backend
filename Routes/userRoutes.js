const express = require('express');
const { getUser, registerUser, loginUser } = require('../Controllers/userController.js');
const { verifyIsloggedIn } = require('../middlewares/verifyTokenAuth.js');
const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
/* user logged in routes */
router.use(verifyIsloggedIn)
/* admin routes */
router.get('/', getUser)
module.exports = router;