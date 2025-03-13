import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    image: {
      type: Array,
     
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    sizes: {
      type: Array,
      required: true,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Number,
      default: () => Date.now(), // current timestamp in milliseconds
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
