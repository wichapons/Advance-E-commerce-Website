const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const ObjectId = require("mongodb").ObjectId;

const getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: new ObjectId(req.user._id) });
        res.send(orders);
    } catch (err) {
        next(err)
    }
}

const getOrderWithUserData = async (req, res, next) => {
    try {
       const order = await Order.findById(req.params.id).populate("user", "-password -isAdmin -_id -__v -createdAt -updatedAt").orFail();
        res.send(order);
    } catch (err) {
        next(err)
    }
}

const createOrder = async (req, res, next) => {
    try {
        const { cartItems, orderTotal, paymentMethod } = req.body;
        if (!cartItems || !orderTotal || !paymentMethod) {
            return res.status(400).send("All inputs are required");
        }

        let arrayOfProductsId = cartItems.map((item) => {
            return item.productID;
        })

        let ArrayOfqty = cartItems.map((item) => {
            return Number(item.quantity);
        })

        await Product.find({ _id: { $in: arrayOfProductsId } }).then((products) => {
            products.forEach(function (product, idx) {
                product.sales += ArrayOfqty[idx]; //increase sales for each product 
                product.save();
            })
        })

        const order = new Order({
            user: new ObjectId(req.user._id),
            orderTotal: orderTotal,
            cartItems: cartItems,
            paymentMethod: paymentMethod,
        })
        const createdOrder = await order.save();
        res.status(201).send(createdOrder);

    } catch (err) {
        next(err)
    }
}


const updateOrderToPaid = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).orFail();
        order.isPaid = true;
        order.paidAt = Date.now();

        const updatedOrder = await order.save();
        res.send(updatedOrder);

    } catch (err) {
        next(err);
    }
}

const updateOrderToDelivered = async (req, res, next) => {
    try {
       const order = await Order.findById(req.params.id).orFail();
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.send(updatedOrder);
    } catch (err) {
        next(err);
    }
}

const getAllOrdersAdmin = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate("user","-password").sort({ paymentMethod: "desc" });
        res.send(orders);
    } catch (err) {
        next(err)
    }
}

const getOrderForAnalysis = async (req, res, next) => {
    try {
        const date = new Date(req.params.date);
        const timezoneOffset = date.getTimezoneOffset();
        const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, -timezoneOffset, 0, 0);
        const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59 - timezoneOffset, 59, 999);

        const order = await Order.find({
            createdAt: {
                $gte: start,
                $lte: end,
            }
        }).sort({ createdAt: "asc" });
        res.send(order);

    } catch (err) {
        next(err)
    }
}


module.exports = {
    getUserOrders:getUserOrders,
    getOrderWithUserData:getOrderWithUserData,
    createOrder:createOrder,
    updateOrderToPaid:updateOrderToPaid,
    updateOrderToDelivered:updateOrderToDelivered,
    getAllOrdersAdmin:getAllOrdersAdmin,
    getOrderForAnalysis:getOrderForAnalysis
}
