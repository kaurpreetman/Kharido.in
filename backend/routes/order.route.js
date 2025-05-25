import express from 'express';
import {
  placeOrder,
  verifyStripe,
  verifyRazorpay,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus
} from '../controllers/order.controller.js';

import { protectRoute } from "../middleware/auth.middleware.js";
import Order from '../models/order.model.js';

const router = express.Router();

router.post('/list', protectRoute, allOrders);
router.post('/status', protectRoute, updateStatus);

router.post('/cod', protectRoute, placeOrder);
router.post('/stripe', protectRoute, placeOrderStripe);
router.post('/razorpay', protectRoute, placeOrderRazorpay);

router.post('/verifyStripe', protectRoute, verifyStripe);
router.post('/verifyRazorpay', protectRoute, verifyRazorpay);

router.get('/user/:userId', protectRoute, userOrders);

router.get('/:id', protectRoute, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
