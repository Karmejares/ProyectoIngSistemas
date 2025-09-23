import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getToken = (getState) => {
  return getState().auth?.token || localStorage.getItem("token");
};

const API_URL =
  import.meta.env && import.meta.env.MODE === "development"
    ? "http://localhost:3001/api/goals"
    : "https://proyectoingsistemas-3.onrender.com/api/goals";

export const fetchGoals = createAsyncThunk(
  "goals/fetchGoals",
  async (_, { rejectWithValue }) => {
    console.log("Fetching goals...");
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Response received:", response.data);
      return response.data.goals;
    } catch (error) {
      console.error("Error in fetchGoals thunk:", error.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const addGoal = createAsyncThunk(
  "goals/addGoal",
  async ({ title, description, plan }, { getState, rejectWithValue }) => {
    const token = getToken(getState);
    try {
      const response = await axios.post(
        API_URL,
        { title, description, plan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Goal added to backend:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error adding goal:", error.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateStepDate = createAsyncThunk(
  "goals/updateStepDate",
  async ({ goalId, stepId, date }, { getState, rejectWithValue }) => {
    const token = getToken(getState);
    try {
      const response = await axios.patch(
        `${API_URL}/${goalId}/plan/step/${stepId}`,
        { date },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 🔄 Remove goal from backend
export const removeGoal = createAsyncThunk(
  "goals/removeGoal",
  async (goalId, { getState, rejectWithValue }) => {
    const token = getToken(getState);
    try {
      const response = await axios.delete(`${API_URL}/${goalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ Goal removed from backend:", response.data);
      return goalId;
    } catch (error) {
      console.error("❌ Error removing goal:", error.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateGoal = createAsyncThunk(
  "goals/updateGoal",
  async ({ _id, title, description, plan }, { getState, rejectWithValue }) => {
    const token = getToken(getState);
    try {
      const response = await axios.put(
        `${API_URL}/${_id}`,
        { title, description, plan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Goal updated on backend:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error updating goal:", error.message);
      return rejectWithValue(error.response.data);
    }
  }
);
const goalsSlice = createSlice({
  name: "goals",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setGoals: (state, action) => {
      state.items = action.payload.goals;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        console.log("Payload received in reducer:", action.payload);
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        const newGoal = {
          ...action.payload,
          history: action.payload.history ?? [], // ✅ Ensure history is always an array
        };
        state.items.push(newGoal);
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        const updatedGoal = action.payload;
        const index = state.items.findIndex(
          (goal) => goal._id === updatedGoal._id
        );
        if (index !== -1) {
          state.items[index] = updatedGoal;
        }
      })
      .addCase(removeGoal.fulfilled, (state, action) => {
        state.items = state.items.filter((goal) => goal._id !== action.payload);
      });
  },
});

export const { setGoals } = goalsSlice.actions;
export default goalsSlice.reducer;
