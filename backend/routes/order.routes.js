// backend/routes/order.routes.js

const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth");
const { adminOnly }         = require("../middleware/adminOnly");
const {
  placeOrder, getOrderHistory, getAllOrders, updateOrderStatus,
} = require("../controllers/order.controller");

router.post("/place-order",                authenticateToken, placeOrder);
router.get("/get-order-history",           authenticateToken, getOrderHistory);
router.get("/get-all-orders",              authenticateToken, adminOnly, getAllOrders);
router.put("/update-order-status/:id",     authenticateToken, adminOnly, updateOrderStatus);

module.exports = router;
