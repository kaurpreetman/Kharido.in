import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;

// 🔄 Fetch Cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const res = await axios.get("http://localhost:5000/api/cart", {
    withCredentials: true
  });

  const items = {};
  res.data.forEach(({ product, size, quantity }) => {
    if (!items[product]) items[product] = {};
    items[product][size] = quantity;
  });
  return items;
});

// ✅ Add to Cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, size, quantity = 1 }, { rejectWithValue }) => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId, size, quantity },
        { withCredentials: true }
      );
      toast.success('Added to cart!');
      return { productId, size, quantity };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
      return rejectWithValue(err.response?.data);
    }
  }
);

// 🔁 Update quantity
export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, size, quantity }, { rejectWithValue }) => {
    try {
      await axios.put(
        "http://localhost:5000/api/cart/update",
        { productId, size, quantity },
        { withCredentials: true }
      );
      return { productId, size, quantity };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
      return rejectWithValue(err.response?.data);
    }
  }
);

// ❌ Remove item
export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async ({ productId, size }, { rejectWithValue }) => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart/removeone",
        { productId, size },
        { withCredentials: true }
      );
      return { productId, size };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Remove failed');
      return rejectWithValue(err.response?.data);
    }
  }
);

// 🧹 Clear cart on server + frontend (used after order success)
export const clearCartOnServer = createAsyncThunk(
  'cart/clearCartOnServer',
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete("http://localhost:5000/api/cart/clear", {
        withCredentials: true,
      });
      return true;
    } catch (err) {
      toast.error("Failed to clear cart");
      return rejectWithValue(err.response?.data || "Clear cart failed");
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: {},
    subtotal: 0,
    totalCount: 0,
    delivery_fee: 10,
    total: 0,
  },
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
    // Local-only clear (you can still use this if needed)
    clearCart: (state) => {
      state.cartItems = {};
      state.subtotal = 0;
      state.totalCount = 0;
      state.total = 0;
    },
    calculateTotals: (state, action) => {
      const products = action.payload;
      let subtotal = 0;
      let count = 0;
      Object.entries(state.cartItems).forEach(([id, sizeMap]) => {
        const p = products.find(pr => pr._id === id);
        if (!p) return;
        Object.values(sizeMap).forEach(qty => {
          subtotal += p.price * qty;
          count += qty;
        });
      });
      state.subtotal = subtotal;
      state.totalCount = count;
      state.total = subtotal + state.delivery_fee;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const { productId, size, quantity } = action.payload;
        if (!state.cartItems[productId]) {
          state.cartItems[productId] = {};
        }
        if (!state.cartItems[productId][size]) {
          state.cartItems[productId][size] = 0;
        }
        state.cartItems[productId][size] += quantity;
      })
      .addCase(updateCartQuantity.fulfilled, (state, { payload }) => {
        const { productId, size, quantity } = payload;
        if (quantity === 0) {
          delete state.cartItems[productId]?.[size];
          if (Object.keys(state.cartItems[productId] || {}).length === 0) {
            delete state.cartItems[productId];
          }
        } else {
          if (!state.cartItems[productId]) state.cartItems[productId] = {};
          state.cartItems[productId][size] = quantity;
        }
      })
      .addCase(removeFromCart.fulfilled, (state, { payload }) => {
        const { productId, size } = payload;
        delete state.cartItems[productId]?.[size];
        if (Object.keys(state.cartItems[productId] || {}).length === 0) {
          delete state.cartItems[productId];
        }
      })
      .addCase(clearCartOnServer.fulfilled, (state) => {
        state.cartItems = {};
        state.subtotal = 0;
        state.totalCount = 0;
        state.total = 0;
      });
  }
});

export const { setCartItems, clearCart, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;
