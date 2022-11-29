const express = require('express');
const { getUserOrders, getOrder, createOrder, updateOrderToPaid, updateOrderToDeliver, getOrders, getOrderForAnalysis } = require('../Controllers/orderController.js');
const { verifyIsloggedIn, verifyAdmin } = require('../middlewares/verifyTokenAuth.js');
const router = express.Router();
/* routes for user */
router.use(verifyIsloggedIn);
router.get('/', getUserOrders)
router.get("/user/:id", getOrder)
router.post("/create", createOrder)
router.put("/paid/:id", updateOrderToPaid)
/* routes for admin */
router.use(verifyAdmin)
router.put("/delivered/:id", updateOrderToDeliver)
router.get("/admin", getOrders)
router.get("/analysis/:date", getOrderForAnalysis)

module.exports = router;