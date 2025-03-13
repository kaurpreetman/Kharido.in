import express from 'express';
import {placeOrder,verifyStripe,placeOrderStripe,placeOrderRazorpay,allOrders,userOrders,updateStatus} from '../controllers/order.controller.js'
import {protectRoute} from "../middleware/auth.middleware.js"
import Order from '../models/order.model.js';
const router=express.Router();
//ADMIN FEATURE
// admin auth should be added 
router.post('/list',allOrders);
router.post('/status',updateStatus);

//PAYMENT FEATURE
router.post('/cod',placeOrder);
router.post('/stripe',placeOrderStripe);
router.post('/razorpay',placeOrderRazorpay)


//user features
router.get('/:userId',protectRoute,userOrders);


router.post('/verifyStripe',protectRoute,verifyStripe)
router.get('/:id', async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate('products.product');
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.json({ order });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
export default router;