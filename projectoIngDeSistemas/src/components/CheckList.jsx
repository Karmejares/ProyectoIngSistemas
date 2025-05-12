import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Alert, // Import Alert for potential error messages
} from "@mui/material";
import GoalList from "./GoalList"; // Import the GoalList component

function CheckList({ goals, setGoals }) {
  const [newGoal, setNewGoal] = useState("");
  const [newGoalFrequency, setNewGoalFrequency] = useState("daily");
  const [customFrequencyDetails, setCustomFrequencyDetails] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [visibleCalendars, setVisibleCalendars] = useState({});
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/goals");
        const data = await response.json();
        console.log("CheckList - Goals after fetch:", data.goals);
        setGoals(data.goals);
      } catch (error) {
        console.error("Error fetching goals:", error);
        setError("Failed to fetch goals. Please try again.");
      }
    };

    fetchGoals();
  }, []);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleAddGoal = async () => {
    if (!newGoal) return;

    const newGoalObject = {
      name: newGoal,
      frequency:
        newGoalFrequency === "custom" ? customFrequencyDetails : "daily",
      history: [],
    };

    try {
      const response = await fetch("http://localhost:3001/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGoalObject),
      });

      if (!response.ok) {
        throw new Error("Failed to add goal.");
      }

      // ✅ Get the new goal with the correct ID from the backend
      const { goal } = await response.json();

      // ✅ Update the frontend state after successful backend update
      setGoals((prevGoals) => [...prevGoals, goal]);
      setNewGoal("");
      setCustomFrequencyDetails([]);
    } catch (error) {
      console.error("Error adding goal:", error);
      setError("Failed to add goal. Please try again.");
    }
  };

  const handleDaySelect = (day) => {
    setCustomFrequencyDetails((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleToggleGoal = async (goalId) => {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === goalId) {
          const updatedHistory = goal.history.includes(today)
            ? goal.history.filter((date) => date !== today) // Remove today's date
            : [...goal.history, today]; // Add today's date

          // Optionally, send the updated goal to the backend
          updateGoalOnBackend({ ...goal, history: updatedHistory });

          return { ...goal, history: updatedHistory }; // Update the goal's history
        }
        return goal;
      })
    );
  };

  // Function to send the updated goal to the backend
  const updateGoalOnBackend = async (updatedGoal) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/goals/${updatedGoal.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedGoal),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update goal on the backend.");
      }
    } catch (error) {
      console.error("Error updating goal on the backend:", error);
    }
  };

  const handleCalendarDayClick = async (goalId, date) => {
    setError(null); // Clear previous errors
    try {
      const response = await fetch(`/api/goals/${goalId}/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completionDate: date }),
      });

      if (!response.ok) {
        throw new Error("Failed to update goal completion.");
      }

      // Update the frontend state after successful backend update
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId && !goal.history.includes(date)
            ? { ...goal, history: [...goal.history, date] }
            : goal
        )
      );
      console.log("CheckList - Goals after calendar click update:", goals);
    } catch (error) {
      console.error("Error updating goal completion:", error);
      setError("Failed to update goal completion. Please try again."); // Set error state
    }
  };

  const handleDeleteGoal = async (id) => {
    setError(null); // Clear previous errors

    try {
      const response = await fetch(`http://localhost:3001/api/goals/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete goal.");
      }

      // ✅ If successful, update frontend state
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
      console.log(`Goal ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting goal:", error);
      setError("Failed to delete goal. Please try again.");
    }
  };

  const toggleCalendarVisibility = (id) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id
          ? { ...goal, isCalendarVisible: !goal.isCalendarVisible }
          : goal
      )
    );
  };

  const handleToggleCalendarVisibility = (id) => {
    setVisibleCalendars((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleDeleteMode = () => {
    setDeleteMode((prev) => !prev);
  };

  const calculateStreak = (goal) => {
    const today = new Date(); // Keep `today` as a Date object
    var todayString = today.toISOString().slice(0, 10); // Use this for comparisons
    const sortedHistory = [...goal.history].sort(); // Ensure history is sorted
    let streak = 0;

    for (let i = sortedHistory.length - 1; i >= 0; i--) {
      if (sortedHistory[i] === todayString) {
        streak++;
        today.setDate(today.getDate() - 1); // Move to the previous day
        todayString = today.toISOString().slice(0, 10); // Update the comparison string
      } else {
        break;
      }
    }

    return streak;
  };

  return (
    <Box
      sx={{
        padding: 2,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <TextField
            fullWidth
            type="text"
            placeholder="Add a new goal"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            label="Add a new goal"
            size="small"
          />
        </Grid>
        <Grid item xs={4}>
          <Select
            fullWidth
            value={newGoalFrequency}
            onChange={(e) => setNewGoalFrequency(e.target.value)}
            size="small"
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleAddGoal}>
            Add
          </Button>
        </Grid>
      </Grid>

      {newGoalFrequency === "custom" && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select days:
          </Typography>
          <Grid container spacing={1}>
            {daysOfWeek.map((day) => (
              <Grid item key={day}>
                <Button
                  variant={
                    customFrequencyDetails.includes(day)
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => handleDaySelect(day)}
                  size="small"
                >
                  {day.slice(0, 3)}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <GoalList
          goals={goals}
          deleteMode={deleteMode}
          handleToggleGoal={handleToggleGoal}
          handleDeleteGoal={handleDeleteGoal}
          toggleCalendarVisibility={toggleCalendarVisibility}
          visibleCalendars={visibleCalendars}
          calculateStreak={calculateStreak}
          handleCalendarDayClick={handleCalendarDayClick} // Pass the new handler
          handleToggleCalendarVisibility={handleToggleCalendarVisibility} // Pass the new handler
        />
        <Button
          onClick={toggleDeleteMode}
          variant="outlined"
          color="secondary"
          sx={{ mt: 2 }}
        >
          {deleteMode ? "Exit Delete Mode" : "Delete Goals"}
        </Button>
      </Box>

      {/* Display error message if there's an error */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

export default CheckList;
