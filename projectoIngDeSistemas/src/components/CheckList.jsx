jsx
import React, { useState, useEffect, useContext } from "react";
import { FaTrash } from "react-icons/fa"; // Import the trash icon from react-icons
import { TextField, Select, MenuItem, Button, List, ListItem, Checkbox, Typography, Grid, Box } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import { FaListAlt } from "react-icons/fa"; // Import calendar icon


import { UserContext } from "./UserContext"; // Import UserContext

function CheckList() {
  const { addCoins } = useContext(UserContext); // Access addCoins from context

  const [goals, setGoals] = useState(() => {
    // Placeholder for fetching goals from backend
    // In a real application, you would fetch data from your API here
    // For now, we'll keep localStorage as a fallback for initial structure
    try {
      const savedGoals = localStorage.getItem("goals");
      return savedGoals ? JSON.parse(savedGoals).map(goal => ({
        ...goal,
        frequency: goal.frequency || { type: 'daily' }, // Initialize with new structure
        history: goal.history || []
      })) : [];
    } catch (error) {
      console.error("Failed to load goals from localStorage (fallback):", error);
      return [];
    }
  });
  const [newGoal, setNewGoal] = useState("");
  const [newGoalFrequency, setNewGoalFrequency] = useState('daily');
  const [deleteMode, setDeleteMode] = useState(false); // State to enable/disable delete mode
  const [customFrequencyDetails, setCustomFrequencyDetails] = useState([]);
  const [visibleCalendars, setVisibleCalendars] = useState({}); // State to manage calendar visibility

  useEffect(() => {
    // Placeholder for fetching goals from backend on mount
    // fetch('/api/goals')
    //   .then(response => response.json())
    //   .then(data => setGoals(data))
    //   .catch(error => console.error('Error fetching goals:', error));
  }, []);

  useEffect(() => {
    // This useEffect is now primarily for updating backend
    // In a real app, you might debounce this or update on specific actions
    localStorage.setItem("goals", JSON.stringify(goals)); // Keep for fallback or remove
    console.log("Goals updated:", goals); // Log for debugging state changes

  }, [goals]);


  const handleAddGoal = () => {
    if (newGoal.trim() === "") return;
    const newGoalObject = {
      id: Date.now(), // Using timestamp as a simple unique ID
      name: newGoal,
      frequency: newGoalFrequency === 'daily' ? { type: 'daily' } : { type: 'custom', details: { days: customFrequencyDetails } },
      history: []
    };
    setGoals((prevGoals) => [...prevGoals, newGoalObject]);
    setNewGoal(""); // Clear input field
    setNewGoalFrequency('daily'); // Reset frequency select
    setCustomFrequencyDetails([]);

    // Placeholder for sending new goal to backend
    // fetch('/api/goals', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newGoalObject)
    // })
    // .then(response => response.json())
    // .then(data => console.log('Goal added to backend:', data))
    // .catch(error => console.error('Error adding goal:', error));
  };

  const handleDeleteGoal = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this goal?"
    );
    if (confirmDelete) {
      setGoals(goals.filter((goal) => goal.id !== id));
    }
    setVisibleCalendars((prev) => { const newVisible = { ...prev }; delete newVisible[id]; return newVisible; }); // Close calendar if open

    // Placeholder for deleting goal in backend
    // fetch(`/api/goals/${id}`, {
    //   method: 'DELETE',
    // })
    // .then(response => console.log('Goal deleted from backend'))
    // .catch(error => console.error('Error deleting goal:', error));

  };

  const handleToggleGoal = (id) => {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
    const updatedGoals = goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            // Toggle date in history
            history: goal.history.includes(today) ? goal.history.filter(date => date !== today) : [...goal.history, today] // Add/remove today's date
          }
        : goal
    );
    setGoals(updatedGoals);

    // Placeholder for updating goal in backend
    // const updatedGoal = updatedGoals.find(goal => goal.id === id); // Find the updated goal
    // fetch(`/api/goals/${id}`, {
    //   method: 'PUT', // or PATCH
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updatedGoal)
    // })
    // .then(response => response.json())
    // .then(data => console.log('Goal updated in backend:', data))
    // .catch(error => console.error('Error updating goal:', error));
  };

  const toggleCalendarVisibility = (id) => {
    setVisibleCalendars((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Helper to check if a date is a scheduled day for a custom goal
  const isScheduledDay = (date, scheduledDays) => {
    const dayOfWeek = daysOfWeek[date.getDay()];
    return scheduledDays.includes(dayOfWeek);
  };

  // Helper to find the previous scheduled date before a given date (Placeholder - needs implementation)
  const findPreviousScheduledDate = (date, scheduledDays) => {
    // This is a more complex helper function that would need to be implemented
    // based on the scheduledDays array. (Logic placeholder)
    // You would need to iterate backward from the given date, checking if each
    // day is a scheduled day, until you find a scheduled day.
    return null; // Placeholder
  };

    const getNextScheduledDay = (currentDay, scheduledDays) => {
    const currentDayIndex = daysOfWeek.indexOf(currentDay);
    const scheduledDayIndices = scheduledDays.map(day => daysOfWeek.indexOf(day)).sort((a, b) => a - b);

    // Find the next scheduled day after the current day
    for (const index of scheduledDayIndices) {
      if (index > currentDayIndex) {
        return daysOfWeek[index];
      }
    }

    // If no scheduled day after current day in the week, wrap around to the first scheduled day of the week
    if (scheduledDayIndices.length > 0) {
      return daysOfWeek[scheduledDayIndices[0]];
    }

    return null; // No scheduled days
  };


  const calculateStreak = (goal) => {
    if (!goal.history || goal.history.length === 0) {
      return 0;
    }

    const sortedHistory = [...goal.history].map(dateString => new Date(dateString)).sort((a, b) => a - b); // Sort dates ascending
    let currentStreak = 0;
    const today = new Date();

    // Start from the most recent completion date
    let lastCompletionDate = sortedHistory[sortedHistory.length - 1];

    // Check if the most recent completion was today
    const mostRecentDateString = lastCompletionDate.toISOString().slice(0, 10);
    const todayString = today.toISOString().slice(0, 10);

    if (mostRecentDateString === todayString) {
        currentStreak = 1;
    } else {
        // If the last completion was not today, check if it was yesterday (for daily)
        // or the last scheduled day (for custom) to start a streak
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayString = yesterday.toISOString().slice(0, 10);

        if (goal.frequency.type === 'daily' && mostRecentDateString === yesterdayString) {
            currentStreak = 1;
        } else if (goal.frequency.type === 'custom' && goal.frequency.details && goal.frequency.details.days) {
             // Need to implement logic here to check if the last completion date
             // was the previous scheduled day relative to today.
             // For now, let's assume if the last completion was on a scheduled day
             // and today is the next scheduled day, the streak is 1.
             // This is still a simplified placeholder.
             const lastCompletionDayOfWeek = daysOfWeek[lastCompletionDate.getDay()];
             const todayDayOfWeek = daysOfWeek[today.getDay()];
             const nextScheduledDayAfterLastCompletion = getNextScheduledDay(lastCompletionDayOfWeek, goal.frequency.details.days);

             if (nextScheduledDayAfterLastCompletion === todayDayOfWeek) {
                currentStreak = 1;
             } else {
                return 0; // No streak if not completed today or yesterday/last scheduled day
             }
        } else {
            return 0; // No streak if not completed today or yesterday/last scheduled day
        }
    }


    // Continue checking for consecutive completions backwards from the second last completion
    for (let i = sortedHistory.length - 2; i >= 0; i--) {
      const completionDate = sortedHistory[i];
      const previousCompletionDate = sortedHistory[i + 1]; // The date after the current one in sorted order

      if (goal.frequency.type === \'daily\') {
        const timeDiff = Math.abs(completionDate.getTime() - previousCompletionDate.getTime());
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          currentStreak++;
        } else if (daysDiff > 1) {
          break; // Gap in streak
        }
      } else if (goal.frequency.type === \'custom\' && goal.frequency.details && goal.frequency.details.days) {
        // More detailed streak logic for custom frequency based on scheduled days
        // Check if the current completionDate is on a scheduled day
        // Check if the previousCompletionDate was the scheduled day immediately following
        // the current completionDate in the schedule.
        const currentDayOfWeek = daysOfWeek[completionDate.getDay()];
        const previousDayOfWeek = daysOfWeek[previousCompletionDate.getDay()];

        const nextScheduledDayAfterCurrent = getNextScheduledDay(currentDayOfWeek, goal.frequency.details.days);

        if (isScheduledDay(completionDate, goal.frequency.details.days) && nextScheduledDayAfterCurrent === previousDayOfWeek) {
             currentStreak++;
        } else {
            break; // Gap in streak
        }
      }
    }

    return currentStreak;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddGoal();
    }
  };

  const toggleDeleteMode = () => {
    setDeleteMode((prevMode) => !prevMode);
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleDaySelect = (day) => {
    setCustomFrequencyDetails(
      customFrequencyDetails.includes(day)
        ? customFrequencyDetails.filter(d => d !== day)
        : [...customFrequencyDetails, day]
    );
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
            onKeyDown={handleKeyDown}
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

      {newGoalFrequency === 'custom' && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Select days:</Typography>
          <Grid container spacing={1}>
            {daysOfWeek.map(day => (
              <Grid item key={day}>
                <Button
                  variant={customFrequencyDetails.includes(day) ? 'contained' : 'outlined'}
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
        <List>
          {goals.map((goal) => (
            <ListItem key={goal.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderBottom: '1px solid #eee' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={goal.history.includes(new Date().toISOString().slice(0, 10))} // Check if completed today
                    onChange={() => handleToggleGoal(goal.id)}
                    disabled={deleteMode} // Disable checkbox in delete mode
                  />
                  <Typography
                    variant="body1"
                    sx={{ textDecoration: goal.history.includes(new Date().toISOString().slice(0, 10)) ? 'line-through' : 'none' }}
                  >
                    {goal.name}
                  </Typography>
                </Box>
                {deleteMode && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteGoal(goal.id)}
                    size="small"
                  >
                    Delete
                  </Button>
                )}
              </Box>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                Streak: {calculateStreak(goal)}
              </Typography>
              <Button size="small" onClick={() => toggleCalendarVisibility(goal.id)} sx={{ mt: 0.5 }}>
                 <FaListAlt style={{ marginRight: 4 }} /> History
              </Button>


              {visibleCalendars[goal.id] && (
                <Box sx={{ mt: 1, width: '100%' }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Completion History:</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <CalendarPicker
                        date={null} // You might set a default date if needed
                        onChange={() => {}} // No-op for visualization
                        renderDay={(day, _value, DayComponentProps) => {
                          const dateString = day.format('YYYY-MM-DD');
                          const isCompleted = goal.history.includes(dateString);
                          return (
                            <div
                              {...DayComponentProps.dayRenderElementProps}
                              style={{
                                backgroundColor: isCompleted ? 'lightblue' : 'transparent',
                                borderRadius: '50%',
                                width: '36px', // Adjust size as needed
                                height: '36px', // Adjust size as needed
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '2px', // Adjust spacing
                                cursor: 'pointer', // Indicate clickable
                              }}
                            >
                              {day.date()}
                            </div>
                          );
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>
              )}
            </ListItem>
          ))}
        </List>
        <Button onClick={toggleDeleteMode} variant="outlined" color="secondary" sx={{ mt: 2 }}>
          {deleteMode ? 'Exit Delete Mode' : 'Delete Goals'}
        </Button>
      </Box>
    </Box>
  );
}

export default CheckList;
