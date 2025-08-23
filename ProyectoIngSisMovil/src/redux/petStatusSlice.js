import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";

const initialState = {
  hungerLevel: 0, // 0 is full, 100 is starving
  status: "happy", // ['happy', 'neutral', 'sad', 'very sad', 'weak']
  foodInventory: [], // List of food items
  lastFed: null,
};

// Fetch hunger level and last fed time from the backend
export const fetchHungerLevel = createAsyncThunk(
  "petStatus/fetchHungerLevel",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/pet/hunger`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Error fetching hunger level:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Feed the pet and refresh hunger level
export const feedPet = createAsyncThunk(
  "petStatus/feedPet",
  async (foodItem, { dispatch, rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/pet/feed`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ foodItem }),
      });
      const data = await response.json();
      dispatch(fetchHungerLevel()); // Re-fetch the hunger status after feeding
      return data;
    } catch (error) {
      console.error("❌ Error feeding pet:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const petStatusSlice = createSlice({
  name: "petStatus",
  initialState,
  reducers: {
    setLastFed: (state, action) => {
      state.lastFed = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHungerLevel.fulfilled, (state, action) => {
        state.hungerLevel = action.payload.hungerLevel;
        state.lastFed = action.payload.lastFed;
        state.status =
          action.payload.hungerLevel <= 20
            ? "happy"
            : action.payload.hungerLevel <= 40
            ? "neutral"
            : action.payload.hungerLevel <= 60
            ? "sad"
            : action.payload.hungerLevel <= 80
            ? "very sad"
            : "weak";
      })
      .addCase(feedPet.fulfilled, (state, action) => {
        state.hungerLevel = 0;
        state.status = "happy";
        state.lastFed = action.payload?.lastFed || new Date().toISOString();
      });
  },
});

export const { setLastFed } = petStatusSlice.actions;
export default petStatusSlice.reducer;
