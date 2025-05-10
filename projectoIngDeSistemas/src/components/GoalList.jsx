// filepath: c:\Users\james\OneDrive\Desktop\Proyecto ING SIS\projectoIngDeSistemas\src\components\GoalList.jsx
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

const GoalList = ({
  goals,
  deleteMode,
  handleToggleGoal,
  handleDeleteGoal,
  toggleCalendarVisibility,
  visibleCalendars,
 handleCalendarDayClick,
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
            onClick={() => toggleCalendarVisibility(goal.id)}
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
                    renderDay={(day, _value, DayComponentProps) => {
                      const { renderDay, ...other } = DayComponentProps;
                      const dateString = day.format("YYYY-MM-DD");
                      const isCompleted = goal.history.includes(dateString);
                      return (
                        <div
                          {...other}
                          style={{
                            backgroundColor: isCompleted && !deleteMode
                              ? "lightblue"
                              : "transparent",
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
