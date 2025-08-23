import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getToken = async (getState) => {
  return getState().auth?.token || (await AsyncStorage.getItem("token"));
};

// Fetch goals from backend
export const fetchGoals = createAsyncThunk(
  "goals/fetchGoals",
  async (_, { rejectWithValue }) => {
    console.log("Fetching goals...");
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/goals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Response received:", data);
      return data.goals;
    } catch (error) {
      console.error("Error in fetchGoals thunk:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Add goal to backend
export const addGoal = createAsyncThunk(
  "goals/addGoal",
  async ({ title, description, plan }, { getState, rejectWithValue }) => {
    const token = await getToken(getState);
    try {
      const response = await fetch("http://localhost:3001/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, plan }),
      });
      const data = await response.json();
      console.log("✅ Goal added to backend:", data);
      return data;
    } catch (error) {
      console.error("❌ Error adding goal:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Update step date in backend
export const updateStepDate = createAsyncThunk(
  "goals/updateStepDate",
  async ({ goalId, stepId, date }, { getState, rejectWithValue }) => {
    const token = await getToken(getState);
    try {
      const response = await fetch(
        `http://localhost:3001/api/goals/${goalId}/plan/step/${stepId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ date }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove goal from backend
export const removeGoal = createAsyncThunk(
  "goals/removeGoal",
  async (goalId, { getState, rejectWithValue }) => {
    const token = await getToken(getState);
    try {
      const response = await fetch(
        `http://localhost:3001/api/goals/${goalId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("✅ Goal removed from backend:", data);
      return goalId;
    } catch (error) {
      console.error("❌ Error removing goal:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Update goal on backend
export const updateGoal = createAsyncThunk(
  "goals/updateGoal",
  async ({ _id, title, description, plan }, { getState, rejectWithValue }) => {
    const token = await getToken(getState);
    try {
      const response = await fetch(`http://localhost:3001/api/goals/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, plan }),
      });
      const data = await response.json();
      console.log("✅ Goal updated on backend:", data);
      return data;
    } catch (error) {
      console.error("❌ Error updating goal:", error.message);
      return rejectWithValue(error.message);
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
          history: action.payload.history ?? [], // Ensure history is always an array
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
