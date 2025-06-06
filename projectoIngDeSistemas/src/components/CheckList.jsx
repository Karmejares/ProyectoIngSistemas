import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Alert, Typography } from "@mui/material";
import GoalList from "./GoalList";
import AddGoal from "./AddGoal"; // Import the AddGoal component
import { useDispatch, useSelector } from "react-redux";
import { fetchGoals, removeGoal } from "../redux/goalsSlice";
import axios from "axios";

function CheckList() {
  const [visibleCalendars, setVisibleCalendars] = useState({});
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false); // Modal state
  // 🔄 Redux Hooks
  const [editGoal, setEditGoal] = useState(null);
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
        },
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
  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button
            variant="contained"
            onClick={handleOpenModal}
            sx={{
              backgroundColor: "#6bb5a2",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#5da894",
              },
              textTransform: "none",
            }}
          >
            ➕ Add New Goal
          </Button>
        </Grid>
        <Grid item sx={{ width: "10%" }}></Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        {goals.length > 0 ? (
          <GoalList
            handleToggleGoal={handleToggleGoal}
            handleDeleteGoal={handleDeleteGoal}
            toggleCalendarVisibility={toggleCalendarVisibility}
            visibleCalendars={visibleCalendars}
            calculateStreak={calculateStreak}
          />
        ) : (
          <Typography variant="h6" sx={{ color: "#4a9c8c" }}>
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
        onClose={() => {
          setOpenModal(false);
          setEditGoal(null);
        }}
        loading={loading}
      />
    </>
  );
}

export default CheckList;
