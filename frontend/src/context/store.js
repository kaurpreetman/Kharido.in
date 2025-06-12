// ✅ src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cartReducer from './cartSlice';
import productReducer from './productSlice';
import addressReducer from './addressSlice';
import uiReducer from './uiSlice';
import orderReducer from './orderSlice'
export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    product: productReducer,
    address: addressReducer,
    ui: uiReducer,
    order: orderReducer
  },
});