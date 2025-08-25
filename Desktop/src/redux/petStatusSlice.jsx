import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  hungerLevel: 0, // 0 is full, 100 is starving
  status: "happy", // ['happy', 'neutral', 'sad', 'very sad', 'weak']
  foodInventory: [], // List of food items
};

// 🔄 Fetch hunger level and last fed time from the backend

export const fetchHungerLevel = createAsyncThunk(
  "petStatus/fetchHungerLevel",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/api/pet/hunger", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching hunger level:", error.message);
      return rejectWithValue(error.response.data);
    }
  }
);

// 🔄 Feed the pet and refresh hunger level
export const feedPet = createAsyncThunk(
  "petStatus/feedPet",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:3001/api/pet/feed",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(fetchHungerLevel()); // Re-fetch the hunger status after feeding
    } catch (error) {
      console.error("❌ Error feeding pet:", error.message);
      return rejectWithValue(error.response.data);
    }
  }
);

const petStatusSlice = createSlice({
  name: "petStatus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHungerLevel.fulfilled, (state, action) => {
        state.hungerLevel = action.payload.hungerLevel;
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
      .addCase(feedPet.fulfilled, (state) => {
        state.hungerLevel = 0;
        state.status = "happy";
      });
  },
});

export default petStatusSlice.reducer;
