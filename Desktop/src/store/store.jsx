import { configureStore } from "@reduxjs/toolkit";
import coinsReducer from "./coinsSlice";
import foodInventoryReducer from "./foodInventorySlice";
import petStatusReducer from "./petStatusSlice";
import goalsReducer from "./goalsSlice"; // ✅ Import the goals reducer from "./foodInventorySlice";

const isDevelopment = import.meta.env.MODE === "development"; // ✅ Vite uses import.meta.env

export const store = configureStore({
  reducer: {
    coins: coinsReducer,
    foodInventory: foodInventoryReducer,
    petStatus: petStatusReducer,
    goals: goalsReducer, // ✅ Add the goals reducer
  },
  devTools: isDevelopment, // ✅ Enable DevTools only in development mode
});
