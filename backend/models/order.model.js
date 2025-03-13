import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                size:{
                    type:String,
                    enum: ["S", "M", "L", "XL"],
                    required:true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        address: {
           
            street: { type: String, required: true },
            city: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true },
            state: { type: String, required: true },
        },
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: [ "cash_on_delivery","stripe","razorpay"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
       
        date: {
            type: Date,
            default: Date.now,
        },
       
        stripeSessionId: {
            type: String,
        
            sparse: true, 
            default: null,
          }

    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
