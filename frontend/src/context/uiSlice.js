// ✅ src/redux/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    search: '',
    lastOrder: null,
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setLastOrder: (state, action) => {
      state.lastOrder = action.payload;
    },
  },
});

export const { setSearch, setLastOrder } = uiSlice.actions;
export default uiSlice.reducer;
