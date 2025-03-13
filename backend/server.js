import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js'
// import couponRoutes from './routes/coupon.route.js'
import paymentRoutes from './routes/payment.route.js'
import cartRoutes from './routes/cart.route.js'
import analyticsRoutes from './routes/analytics.route.js'
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import connectCloudinary from './lib/cloudinary.js'
import cors from 'cors';
import orderRouter from './routes/order.route.js';
dotenv.config();
const app=express();
const PORT=process.env.PORT || 5000;


connectDB();
connectCloudinary();

app.use(cors({
    origin:'http://localhost:5713',
    credentials: true

}))
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth",authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
// app.use("/api/coupons",couponRoutes);
app.use("/api/payments",paymentRoutes);
app.use("/api/analytics",analyticsRoutes);
app.use("/api/orders",orderRouter);

app.listen(5000,()=>{
    console.log(`Server is running on port ${PORT}`);
});