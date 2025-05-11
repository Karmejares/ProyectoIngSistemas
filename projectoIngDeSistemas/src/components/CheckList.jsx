import React, { useState } from "react";
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

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleAddGoal = () => {
    if (!newGoal) return;

    const newGoalObject = {
      id: Date.now(),
      name: newGoal,
      frequency:
        newGoalFrequency === "custom" ? customFrequencyDetails : "daily",
      history: [],
    };

    setGoals([...goals, newGoalObject]);
    setNewGoal("");
    setCustomFrequencyDetails([]);
  };

  const handleDaySelect = (day) => {
    setCustomFrequencyDetails((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleToggleGoal = (id) => {
    const today = new Date();
    const dateString = today.toISOString().slice(0, 10);

    // Optimistically update the UI
 setGoals(prevGoals =>
 prevGoals.map(goal =>
 goal.id === id
 ? {
 ...goal,
 history: goal.history.includes(dateString)
 ? goal.history.filter(date => date !== dateString)
 : [...goal.history, dateString],
 }
 : goal
 )
 );

    // Call the backend API to update the history
 fetch(`/api/goals/${id}/complete`, {
 method: 'PUT',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ completionDate: dateString }),
  });
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
    } catch (error) {
      console.error("Error updating goal completion:", error);
      setError("Failed to update goal completion. Please try again."); // Set error state
    }
  };

  const handleDeleteGoal = (id) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
  };

  const toggleCalendarVisibility = (id) => {
    setVisibleCalendars((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleDeleteMode = () => {
    setDeleteMode((prev) => !prev);
  };

  const calculateStreak = (goal) => {
 if (!goal.history || goal.history.length === 0) {
 return 0;
 }

    // Convert date strings to Date objects and sort them
    const sortedDates = goal.history.map(dateString => new Date(dateString)).sort((a, b) => a - b);

    let currentStreak = 0;
    // Iterate backwards from the most recent date
 for (let i = sortedDates.length - 1; i >= 0; i--) {
      const currentDate = sortedDates[i];
      const previousDate = sortedDates[i - 1];

 if (i === sortedDates.length - 1 || (previousDate && currentDate.getDate() === previousDate.getDate() + 1 && currentDate.getMonth() === previousDate.getMonth() && currentDate.getFullYear() === previousDate.getFullYear())) {
 currentStreak++;
 } else if (previousDate && (currentDate.getDate() !== previousDate.getDate() + 1 || currentDate.getMonth() !== previousDate.getMonth() || currentDate.getFullYear() !== previousDate.getFullYear())) {
 break; // Streak broken
      }
    }

    return currentStreak;
  };

  return (
    <Box sx={{ padding: 2 }}>
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
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}

export default CheckList;
