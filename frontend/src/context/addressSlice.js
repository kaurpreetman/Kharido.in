// src/context/addressSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Helpers to sync with localStorage
const getLocalAddresses = () => JSON.parse(localStorage.getItem("addresses")) || [];
const getLocalSelected = () => JSON.parse(localStorage.getItem("selectedAddress")) || null;

const initialState = {
  addresses: getLocalAddresses(),
  selectedAddress: getLocalSelected(),
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    addAddress: (state, action) => {
      state.addresses.push(action.payload);
      localStorage.setItem("addresses", JSON.stringify(state.addresses));
    },
    updateAddress: (state, action) => {
      const { index, updatedAddress } = action.payload;
      state.addresses[index] = updatedAddress;
      localStorage.setItem("addresses", JSON.stringify(state.addresses));
    },
    deleteAddress: (state, action) => {
      state.addresses.splice(action.payload, 1);
      localStorage.setItem("addresses", JSON.stringify(state.addresses));
      if (state.selectedAddress && state.addresses.every(addr => JSON.stringify(addr) !== JSON.stringify(state.selectedAddress))) {
        state.selectedAddress = null;
        localStorage.removeItem("selectedAddress");
      }
    },
    selectAddress: (state, action) => {
      state.selectedAddress = action.payload;
      localStorage.setItem("selectedAddress", JSON.stringify(action.payload));
    },
    clearAddresses: (state) => {
      state.addresses = [];
      state.selectedAddress = null;
      localStorage.removeItem("addresses");
      localStorage.removeItem("selectedAddress");
    }
  }
});

export const { addAddress, updateAddress, deleteAddress, selectAddress, clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;
