// backend/controllers/order.controller.js

const User     = require("../models/user.model");
const Order    = require("../models/order.model");
const AppError = require("../utils/AppError");

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/place-order  (protected)
// Places orders for all books currently in the cart.
// ─────────────────────────────────────────────────────────────────────────────
const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { order } = req.body;

    if (!Array.isArray(order) || order.length === 0) {
      return next(new AppError("Order must be a non-empty array of books.", 400));
    }

    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found.", 404));

    // Create an Order document for each book
    const orderPromises = order.map((book) =>
      new Order({ user: userId, book: book._id }).save()
    );
    const savedOrders = await Promise.all(orderPromises);

    // Add all order IDs to the user's orders array
    const orderIds = savedOrders.map((o) => o._id);
    await User.findByIdAndUpdate(userId, { $push: { orders: { $each: orderIds } } });

    // Clear the user's cart after placing the order
    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

    res.status(201).json({ status: "success", message: "Order placed successfully!" });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/get-order-history  (protected)
// Returns order history for the logged-in user.
// ─────────────────────────────────────────────────────────────────────────────
const getOrderHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate({
      path: "orders",
      populate: { path: "book" },
      options: { sort: { createdAt: -1 } },
    });

    if (!user) return next(new AppError("User not found.", 404));

    res.json({ status: "success", data: user.orders.reverse() });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/get-all-orders  (admin only)
// Returns all orders in the system for the admin dashboard.
// ─────────────────────────────────────────────────────────────────────────────
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("book")
      .populate("user", "-password") // exclude password from user data
      .sort({ createdAt: -1 });

    res.json({ status: "success", data: orders });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/v1/update-order-status/:id  (admin only)
// Updates the delivery status of an order.
// ─────────────────────────────────────────────────────────────────────────────
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return next(new AppError("Status is required.", 400));

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("book").populate("user", "-password");

    if (!updatedOrder) return next(new AppError("Order not found.", 404));

    res.json({ status: "success", data: updatedOrder });
  } catch (error) {
    next(error);
  }
};

module.exports = { placeOrder, getOrderHistory, getAllOrders, updateOrderStatus };
