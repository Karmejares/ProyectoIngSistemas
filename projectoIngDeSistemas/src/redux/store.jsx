import { configureStore } from "@reduxjs/toolkit";
import coinsReducer from "./coinsSlice";
import foodInventoryReducer from "./foodInventorySlice";

const isDevelopment = import.meta.env.MODE === "development"; // ✅ Vite uses import.meta.env

export const store = configureStore({
  reducer: {
    coins: coinsReducer,
    foodInventory: foodInventoryReducer,
  },
  devTools: isDevelopment, // ✅ Enable DevTools only in development mode
});
