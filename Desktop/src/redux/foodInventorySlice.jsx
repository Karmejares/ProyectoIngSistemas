import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Utility function to get the token
const getToken = (getState) => {
  return getState().auth?.token || localStorage.getItem("token");
};

// 🔄 Fetch inventory from backend
export const fetchInventory = createAsyncThunk(
  "foodInventory/fetchInventory",
  async (_, { getState, rejectWithValue }) => {
    const token = getToken(getState);
    console.log("🔄 Fetching inventory with token:", token);
    try {
      const response = await axios.get(
        "http://localhost:3001/api/pet/inventory",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Inventory fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching inventory:", error.message);
      return rejectWithValue(error.response.data);
    }
  }
);

// 🔄 Add food to backend
export const addFoodToBackend = createAsyncThunk(
  "foodInventory/addFoodToBackend",
  async ({ foodItem }, { getState, rejectWithValue }) => {
    const token = getToken(getState);
    console.log("🔄 Adding food to backend:", foodItem);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/pet/inventory/add",
        { foodItem },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Food added to backend successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error adding food to backend:", error.message);
      return rejectWithValue(error.response.data);
    }
  }
);

// 🔄 Remove food from backend
export const removeFoodFromBackend = createAsyncThunk(
  "foodInventory/removeFoodFromBackend",
  async ({ foodItem }, { getState, rejectWithValue }) => {
    const token = getToken(getState);
    console.log("🔄 Removing food from backend:", foodItem);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/pet/inventory/remove",
        { foodItem },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Food removed from backend successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error removing food from backend:", error.message);
      return rejectWithValue(error.response.data);
    }
  }
);

const foodInventorySlice = createSlice({
  name: "foodInventory",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setInventory: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addFoodToBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addFoodToBackend.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(addFoodToBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(removeFoodFromBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFoodFromBackend.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(removeFoodFromBackend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setInventory } = foodInventorySlice.actions;
export default foodInventorySlice.reducer;
