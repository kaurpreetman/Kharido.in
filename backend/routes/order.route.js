import express from 'express';
import {
  placeOrder,
  verifyStripe,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  getUserOrders,
  updateStatus,
  returnOrder,
  cancelOrder,  // ✅ ADD THIS
} from '../controllers/order.controller.js';

import { protectRoute } from "../middleware/auth.middleware.js";
import Order from '../models/order.model.js';

const router = express.Router();

// ADMIN FEATURES
router.post('/list',allOrders); // ✅ You can add admin middleware here later
router.post('/status',updateStatus); // ✅ Should be admin-protected ideally

// PAYMENT FEATURE
router.post('/cod', protectRoute, placeOrder);
router.post('/stripe', protectRoute, placeOrderStripe);
router.post('/razorpay', protectRoute, placeOrderRazorpay);

// VERIFY STRIPE PAYMENT
router.post('/verifyStripe', protectRoute, verifyStripe);

// USER FEATURES
router.get('/user/:id', protectRoute, getUserOrders);

// GET ORDER BY ID
router.get('/:id', protectRoute, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Optional ownership check
    // if (req.user._id.toString() !== order.user.toString()) {
    //   return res.status(403).json({ message: 'Unauthorized access' });
    // }

    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ ADD THESE ROUTES FOR RETURN & CANCEL
router.post('/return', protectRoute, returnOrder);
router.post('/cancel', protectRoute, cancelOrder);

export default router;
