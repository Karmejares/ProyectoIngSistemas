import { configureStore } from "@reduxjs/toolkit";
import coinsReducer from "./coinsSlice";
import foodInventoryReducer from "./foodInventorySlice";
import petStatusReducer from "./petStatusSlice";
import goalsReducer from "./goalsSlice";

const isDevelopment = __DEV__; // React Native uses __DEV__ instead of import.meta.env

export const store = configureStore({
  reducer: {
    coins: coinsReducer,
    foodInventory: foodInventoryReducer,
    petStatus: petStatusReducer,
    goals: goalsReducer,
  },
  devTools: isDevelopment, // Enable DevTools only in development mode
});
