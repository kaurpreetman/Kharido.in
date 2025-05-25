import Order from "../models/order.model.js";
import Stripe from "stripe";
import dotenv from 'dotenv';
import Razorpay from "razorpay";
import User from "../models/user.model.js";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Place Order (COD & Bank Transfer)
const placeOrder = async (req, res) => {
    try {
      const { user, products, totalAmount, address, paymentMethod } = req.body;
  
      if (!user || !products.length || !totalAmount || !address || !paymentMethod) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const newOrder = new Order({
        user,
        products,
        totalAmount,
        address,
        paymentMethod,
        paymentStatus: paymentMethod === "cash_on_delivery" ? "pending" : "failed",
        status: "pending",
      });
  
      await newOrder.save();
  
      await User.findByIdAndUpdate(user, {
        $push: { orders: { product: newOrder._id } }, // optional: adjust quantity if needed
        $set: { cartItems: {} },
      });
  
      res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

  import Product from "../models/Product.model.js"; // adjust if your import path is different

const placeOrderStripe = async (req, res) => {
  try {
    const { user, products, totalAmount, address, paymentMethod } = req.body;

    if (!user || !products.length || !totalAmount || !address || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const deliveryCharge = 10; // ₹10
    const currency = "inr";

    // Step 1: Fetch full product data from DB
    

    // Step 4: Create Order and save to DB
    const newOrder = new Order({
      user,
      products,
      totalAmount,
      address,
      paymentMethod: "stripe",
      paymentStatus: "pending",
      status: "pending",
     
    });

    await newOrder.save();
    const enrichedProducts = await Promise.all(
      products.map(async (item) => {
        const productDoc = await Product.findById(item.product);
        if (!productDoc) throw new Error(`Product not found: ${item.product}`);
        return {
          ...item,
          product_name: productDoc.name,
        };
      })
    );

    // Step 2: Build line_items for Stripe
    const line_items = [
      ...enrichedProducts.map((item) => ({
        price_data: {
          currency,
          product_data: {
            name: item.product_name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      {
        price_data: {
          currency,
          product_data: { name: "Delivery Charge" },
          unit_amount: deliveryCharge * 100,
        },
        quantity: 1,
      },
    ];

    // Step 3: Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/order-success?orderId=${newOrder._id}&userId=${user}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
    });

    res.status(201).json({ sessionId: session.id, order: newOrder });
  } catch (error) {
    console.error("Stripe order error:", error);
    res.status(500).json({ message: "Stripe payment failed", error: error.message });
  }
};

const verifyStripe=async(req,res)=>{
  const {orderId,success,userId}=req.body;
  console.log("YESSSS");
  try{
    if(success==="true"){
      await Order.findByIdAndUpdate(orderId,{paymentStatus:"paid" })
      await User.findByIdAndUpdate(userId,{cartItems:{}});
      res.json({success:true});
    }
    else{
      await Order.findByIdAndDelete(orderId,{paymentStatus:"failed"});
      res.json({success:false});
    }
  }
  catch(error){
    console.log(error);
    res.json({success:false,message:error.message})
  }
}
import crypto from "crypto";

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, userId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });

      await User.findByIdAndUpdate(userId, { cartItems: {} });

      res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: "failed" });
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Razorpay verification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Place Order with Razorpay
const placeOrderRazorpay = async (req, res) => {
  try {
    const { user, products, totalAmount, address } = req.body;

    if (!user || !products.length || !totalAmount || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const options = {
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const newOrder = new Order({
      user,
      products,
      totalAmount,
      address,
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      status: "pending",
      razorpayOrderId: razorpayOrder.id, // Optional: helpful for tracking
    });

    await newOrder.save();

    res.status(201).json({ orderId: razorpayOrder.id, order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Razorpay payment failed", error: error.message });
  }
};

// Get all orders for Admin
const allOrders = async (req, res) => {
    // try {
    //     const orders = await Order.find()
    //         .populate("user", "name email")
    //         .populate("products.product", "name price");
    //     res.status(200).json(orders);
    // } catch (error) {
    //     res.status(500).json({ message: "Server error", error: error.message });
    // }
};

// Get user orders for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update Order Status (Admin)
const updateStatus = async (req, res) => {
    // try {
    //     const { status } = req.body;
    //     const { orderId } = req.params;

    //     const order = await Order.findById(orderId);
    //     if (!order) {
    //         return res.status(404).json({ message: "Order not found" });
    //     }

    //     order.status = status;
    //     await order.save();

    //     res.status(200).json({ message: "Order status updated successfully", order });
    // } catch (error) {
    //     res.status(500).json({ message: "Server error", error: error.message });
    // }
};


export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
};

