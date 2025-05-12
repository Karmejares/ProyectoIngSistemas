import React from "react";
import {
  List,
  ListItem,
  Box,
  Checkbox,
  Typography,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { FaListAlt } from "react-icons/fa";
import dayjs from "dayjs";

// ✅ Custom DayRenderer Component
const DayRenderer = (props) => {
  const { day, value, history } = props;

  // Guard clause to prevent crashing
  if (!day) {
    return <div {...props} />;
  }

  const dateString = day.format("YYYY-MM-DD");
  const formattedHistory = history.map((date) =>
    dayjs(date).format("YYYY-MM-DD")
  );

  const isCompleted = formattedHistory.includes(dateString);
  const isSelected = day.isSame(value, "day");

  console.log("Rendering day:", dateString, "Completed:", isCompleted);

  return (
    <div
      {...props}
      style={{
        backgroundColor: isCompleted
          ? "#4CAF50" // Green if completed
          : isSelected
          ? "#2196F3" // Blue if selected
          : "transparent",
        color: isCompleted ? "white" : "inherit",
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "2px",
        cursor: "pointer",
      }}
    >
      {day.date()}
    </div>
  );
};

const GoalList = ({
  goals,
  deleteMode,
  handleToggleGoal,
  handleDeleteGoal,
  handleToggleCalendarVisibility,
  visibleCalendars,
  calculateStreak,
}) => {
  return (
    <List>
      {goals.map((goal) => (
        <ListItem
          key={goal.id}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            borderBottom: "1px solid #eee",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={goal.history.includes(
                  new Date().toISOString().slice(0, 10)
                )}
                onChange={() => handleToggleGoal(goal.id)}
                disabled={deleteMode}
              />
              <Typography
                variant="body1"
                sx={{
                  textDecoration: goal.history.includes(
                    new Date().toISOString().slice(0, 10)
                  )
                    ? "line-through"
                    : "none",
                }}
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
          <Button
            size="small"
            onClick={() => handleToggleCalendarVisibility(goal.id)}
            sx={{ mt: 0.5 }}
          >
            <FaListAlt style={{ marginRight: 4 }} /> History
          </Button>

          {visibleCalendars[goal.id] && (
            <Box sx={{ mt: 1, width: "100%" }}>
              <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                Completion History:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    disableFuture
                    slots={{
                      day: (props) => (
                        <DayRenderer {...props} history={goal.history} />
                      ),
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Box>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default GoalList;
