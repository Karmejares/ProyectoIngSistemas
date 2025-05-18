import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Alert, Typography } from "@mui/material";
import GoalList from "./GoalList";
import AddGoal from "./AddGoal"; // Import the AddGoal component
import { useDispatch, useSelector } from "react-redux";
import { addGoal, fetchGoals, removeGoal } from "../redux/goalsSlice";
import axios from "axios";

function CheckList() {
  const [deleteMode, setDeleteMode] = useState(false);
  const [visibleCalendars, setVisibleCalendars] = useState({});
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false); // Modal state
  // 🔄 Redux Hooks
  const dispatch = useDispatch();
  const goals = useSelector((state) => state.goals?.items || []);
  const [loading, setLoading] = useState(false);
  // ✅ Fetch goals when component mounts
  useEffect(() => {
    dispatch(fetchGoals()).catch((err) => {
      console.error("Error fetching goals:", err);
      setError("Failed to fetch goals. Please try again.");
    });
  }, [dispatch]);

  // ✅ Toggle Calendar Visibility
  const toggleCalendarVisibility = (id) => {
    setVisibleCalendars((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ✅ Handle Delete Goal
  const handleDeleteGoal = (id) => {
    dispatch(removeGoal(id)).catch((error) => {
      console.error("Error deleting goal:", error);
      setError("Failed to delete goal. Please try again.");
    });
  };

  // ✅ Toggle Delete Mode
  const toggleDeleteMode = () => {
    setDeleteMode((prev) => !prev);
  };

  // ✅ Calculate Streak
  const calculateStreak = (goal) => {
    const today = new Date();
    var todayString = today.toISOString().slice(0, 10);
    const sortedHistory = [...goal.history].sort();
    let streak = 0;

    for (let i = sortedHistory.length - 1; i >= 0; i--) {
      if (sortedHistory[i] === todayString) {
        streak++;
        today.setDate(today.getDate() - 1);
        todayString = today.toISOString().slice(0, 10);
      } else {
        break;
      }
    }

    return streak;
  };

  // ✅ Handle Checkbox Toggle Logic
  const handleToggleGoal = async (goalId) => {
    const token = localStorage.getItem("token");
    const today = new Date().toISOString().slice(0, 10);

    console.log(`Toggling goal: ${goalId} for date: ${today}`);

    try {
      const response = await axios.put(
        `http://localhost:3001/api/goals/${goalId}/toggle`,
        { date: today },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response.data);

      // Optionally, update the state or refetch goals if needed
      dispatch(fetchGoals());
    } catch (error) {
      console.error("❌ Error updating goal status:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  // ✅ Open Modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // ✅ Close Modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // ✅ Refresh Goals List After Adding New One
  const refreshGoals = async (newGoal) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      console.log("🚀 Sending new goal to server...");

      // ✅ Make the request with the Authorization header
      await axios.post("http://localhost:3001/api/goals", newGoal, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Goal added successfully!");

      // ✅ Re-fetch goals after adding
      await dispatch(fetchGoals());
    } catch (error) {
      console.error("❌ Error adding goal:", error.message);
      if (error.response && error.response.data) {
        console.error("Server response:", error.response.data);
        setError(error.response.data.message);
      } else {
        setError("Failed to add the goal. Please try again.");
      }
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button variant="contained" onClick={handleOpenModal}>
            ➕ Add New Goal
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={toggleDeleteMode}
            variant="outlined"
            color="secondary"
          >
            {deleteMode ? "Exit Delete Mode" : "Delete Goals"}
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        {goals.length > 0 ? (
          <GoalList
            handleToggleGoal={handleToggleGoal}
            deleteMode={deleteMode}
            handleDeleteGoal={handleDeleteGoal}
            toggleCalendarVisibility={toggleCalendarVisibility}
            visibleCalendars={visibleCalendars}
            calculateStreak={calculateStreak}
          />
        ) : (
          <Typography variant="h6" color="textSecondary">
            No goals found. Try adding a new goal!
          </Typography>
        )}
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* ✅ AddGoal Modal */}
      <AddGoal
        open={openModal}
        onClose={handleCloseModal}
        onSave={refreshGoals}
        loading={loading}
      />
    </Box>
  );
}

export default CheckList;
