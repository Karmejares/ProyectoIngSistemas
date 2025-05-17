import { createSlice } from "@reduxjs/toolkit";

const foodInventorySlice = createSlice({
  name: "foodInventory",
  initialState: {
    items: [],
  },
  reducers: {
    addFood: (state, action) => {
      state.items.push(action.payload);
    },
    removeFood: (state, action) => {
      state.items = state.items.filter((food) => food !== action.payload);
    },
    setInventory: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { addFood, removeFood, setInventory } = foodInventorySlice.actions;
export default foodInventorySlice.reducer;
("");
