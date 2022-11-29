const express = require('express');
const { getUser, registerUser, loginUser, userUpdateProfile, getUserProfile, writeReview, adminGetUser, adminUpdateUser, deleteUser } = require('../Controllers/userController.js');
const { verifyIsloggedIn } = require('../middlewares/verifyTokenAuth.js');
const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
/* user logged in routes */
router.use(verifyIsloggedIn)
router.put("/profile", userUpdateProfile)
router.get("/profile/:id", getUserProfile)
router.post("/review/:productId", writeReview)
/* admin routes */
router.get('/', getUser)
router.get("/:id",adminGetUser)
router.put("/:id",adminUpdateUser)
router.delete("/:id",deleteUser)
module.exports = router;