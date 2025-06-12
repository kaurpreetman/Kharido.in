import express from 'express';
import {
  placeOrder,
  verifyStripe,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  getUserOrders,
  cancelOrder,
  updateStatus,
  returnOrder,
  cancelOrder,  // ✅ ADD THIS
} from '../controllers/order.controller.js';

import { protectRoute } from "../middleware/auth.middleware.js";
import Order from '../models/order.model.js';

const router = express.Router();

// ADMIN FEATURES
// Protect with authentication, and optionally, check for admin
router.post('/list',protectRoute, allOrders);
router.post('/cancel',protectRoute, cancelOrder);
router.post('/status',protectRoute, updateStatus); // Should be admin-protected ideally

// PAYMENT FEATURE
router.post('/cod', protectRoute, placeOrder);
router.post('/stripe', protectRoute, placeOrderStripe);
router.post('/razorpay', protectRoute, placeOrderRazorpay);

// VERIFY STRIPE PAYMENT
router.post('/verifyStripe', protectRoute, verifyStripe);

// USER FEATURES
router.get('/user/:id', protectRoute, getUserOrders);

// GET /api/orders/:userId/:orderId
router.get('/:userId/:orderId', async (req, res) => {
  const { userId, orderId } = req.params;

  try {
    const order = await Order.findOne({ _id: orderId, user: userId }).populate("products.product");
    console.log(order);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Order fetch error:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});


export default router;
