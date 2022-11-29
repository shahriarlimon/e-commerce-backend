const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const { findById } = require("../models/UserModel");
const User = require("../models/UserModel");
const ObjectId = require("mongodb").ObjectId

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: ObjectId(req.user._id) })
        return res.send(orders)
    } catch (error) {
        next(error)
    }
}
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "-password -isAdmin -_id -_v -createdAt -updatedAt").orFail();
        res.send(order)
    } catch (error) {
        next(error)
    }
}

exports.createOrder = async (req, res, next) => {
    try {
        const { cartItems, orderTotal, paymentMethod } = req.body;
        if (!cartItems || !orderTotal || !paymentMethod) {
            return res.status(400).send("All inputs are required")
        }
        let ids = cartItems.map((item) => {
            return item.productID
        })
        let qty = cartItems.map((item) => {
            return Number(item.quantity)
        })
        await Product.find({ id: { $in: ids } }).then((products) => {
            products.forEach(function (product, idx) {
                product.sales += qty[idx]
            })
        })
        const order = new Order({
            user: ObjectId(req.user._id),
            orderTotal: orderTotal,
            cartItems: cartItems,
            paymentMethod: paymentMethod
        })
        const createOrder = await order.save();
        res.status(201).send(createOrder)

    } catch (error) {
        next(error)
    }
}

exports.updateOrderToPaid = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).orFail()
        order.isPaid = true;
        order.paidAt = Date.now()
        const updatedOrder = await order.save()
        res.send(updatedOrder)
    } catch (error) {
        next(error)
    }
}

exports.updateOrderToDeliver = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).orFail();
        order.isDelivered = true;
        orderDeliveredAt = Date.now()
        const updatedOrder = await order.save()
        res.send(updatedOrder)
    } catch (error) {
        next(error)
    }
}

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate("user", "-password").sort({ paymentMethod: "desc" })
        res.send(orders)
    } catch (error) {
        next(error)
    }
}

exports.getOrderForAnalysis = async (req, res, next) => {
    try {
        const start = new Date(req.params.date)
        start.setHours(0, 0, 0, 0);
        const end = new Date(req.params.date)
        end.setHours(23, 59, 59, 999);
        const order = await Order.find({
            createdAt: {
                $gte: start,
                $lte: end
            }
        })
        res.send(order)
    } catch (error) {
        next(error)
    }
}