import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { fetchCart } from './cartSlice';

// ✅ Always send cookies/session
axios.defaults.withCredentials = true;

// 🔄 Fetch All Products
export const fetchProducts = createAsyncThunk('product/fetchAll', async (_, { dispatch }) => {
  try {
    const res = await axios.get("http://localhost:5000/api/products/all", {
      withCredentials: true, // ⬅️ Explicit here too
    });
    dispatch(fetchCart());
    return res.data.products;
  } catch (e) {
    toast.error("Failed to load products");
    throw e;
  }
});

// 🌟 Fetch Bestsellers
export const fetchBestsellers = createAsyncThunk('product/fetchBestsellers', async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/products/bestseller", {
      withCredentials: true,
    });
    return res.data.data;
  } catch (e) {
    toast.error("Failed to load bestsellers");
    throw e;
  }
});

// 📦 Fetch Single Product
export const fetchSingleProduct = createAsyncThunk('product/fetchSingleProduct', async (id) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/products/getsingle",
      { productId: id },
      { withCredentials: true }
    );
    return res.data.product;
  } catch (e) {
    toast.error("Failed to load product");
    throw e;
  }
});

// 🧩 Product Slice
const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    bestsellers: [],
    singleProduct: null,
    loading: false,
    loadingSingle: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // 🛒 All Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      });

    // 🌟 Bestsellers
    builder
      .addCase(fetchBestsellers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBestsellers.fulfilled, (state, action) => {
        state.bestsellers = action.payload;
        state.loading = false;
      })
      .addCase(fetchBestsellers.rejected, (state) => {
        state.loading = false;
      });

    // 📦 Single Product
    builder
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loadingSingle = true;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.singleProduct = action.payload;
        state.loadingSingle = false;
      })
      .addCase(fetchSingleProduct.rejected, (state) => {
        state.loadingSingle = false;
      });
  },
});

export default productSlice.reducer;
