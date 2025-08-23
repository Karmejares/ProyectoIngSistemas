import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../config/api";

export const fetchCoins = createAsyncThunk(
  "coins/fetchCoins",
  async (token) => {
    const response = await fetch(API_ENDPOINTS.COINS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data.coins;
  }
);

export const updateCoinsOnServer = createAsyncThunk(
  "coins/updateCoinsOnServer",
  async ({ amount, token }) => {
    await fetch(`${API_ENDPOINTS.COINS}/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ coins: amount }),
    });
    return amount;
  }
);

const coinsSlice = createSlice({
  name: "coins",
  initialState: {
    amount: 0,
    status: "idle",
    error: null,
  },
  reducers: {
    // Existing Reducers
    addCoins: (state, action) => {
      state.amount += action.payload;
    },
    removeCoins: (state, action) => {
      state.amount = Math.max(0, state.amount - action.payload);
    },

    // New Reducers for adding/removing 10 coins
    addTenCoins: (state) => {
      state.amount += 10;
    },
    removeTenCoins: (state) => {
      state.amount = Math.max(0, state.amount - 10);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.amount = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCoins.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCoinsOnServer.fulfilled, (state, action) => {
        state.amount = action.payload;
      });
  },
});

export const { addCoins, removeCoins, addTenCoins, removeTenCoins } =
  coinsSlice.actions;
export default coinsSlice.reducer;
