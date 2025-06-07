import express from 'express';
import {
  placeOrder,
  verifyStripe,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  getUserOrders,
  updateStatus,
} from '../controllers/order.controller.js';

import { protectRoute } from "../middleware/auth.middleware.js";
import Order from '../models/order.model.js';

const router = express.Router();

// ADMIN FEATURES
// Protect with authentication, and optionally, check for admin
router.post('/list', allOrders);
router.post('/status', updateStatus); // Should be admin-protected ideally

// PAYMENT FEATURE (may not require login depending on your use case)
router.post('/cod', protectRoute, placeOrder);
router.post('/stripe', protectRoute, placeOrderStripe);
router.post('/razorpay', protectRoute, placeOrderRazorpay);

// VERIFY STRIPE PAYMENT (must be protected)
router.post('/verifyStripe', protectRoute, verifyStripe);

// USER FEATURES (get orders for a specific user)
router.get('/user/:id', protectRoute, getUserOrders);

// GET ORDER BY ID (should be protected)
router.get('/:id', protectRoute, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Optional: check if the user owns the order
    // if (req.user._id.toString() !== order.user.toString()) {
    //   return res.status(403).json({ message: 'Unauthorized access' });
    // }

    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
