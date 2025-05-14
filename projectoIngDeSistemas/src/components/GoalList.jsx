import React, { useState, useContext } from "react";
import {
  List,
  ListItem,
  Box,
  Checkbox,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Collapse,
  Snackbar,
  Alert,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { FaListAlt } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import DayRenderer from "./DayRenderer";
import dayjs from "dayjs";
import { UserContext } from "./UserContext"; // ✅ Import UserContext

const GoalList = ({
  goals,
  deleteMode,
  handleToggleGoal,
  handleDeleteGoal,
  toggleCalendarVisibility,
  visibleCalendars,
  calculateStreak,
  handleCalendarDayClick,
  handleToggleCalendarVisibility,
}) => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [open, setOpen] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  // ✅ Import addCoins and removeCoins from your UserContext
  const { addCoins, removeCoins } = useContext(UserContext);

  // ✅ Open Modal
  const handleOpenModal = (goal) => {
    setSelectedGoal(goal);
    setOpen(true);
  };

  // ✅ Close Modal
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedGoal(null);
  };

  // ✅ Handle Checkbox change (Add or Remove Coins)
  const handleCheckboxChange = (goal) => {
    handleToggleGoal(goal.id);

    const today = new Date().toISOString().slice(0, 10);

    if (goal.history.includes(today)) {
      // ✅ Unchecked => Remove 10 Coins
      removeCoins(10);
      setSnackbarMessage("💔 10 Coins Removed!");
      setAlertSeverity("error");
    } else {
      // ✅ Checked => Add 10 Coins
      addCoins(10);
      setSnackbarMessage("🎉 10 Coins Added!");
      setAlertSeverity("success");
    }
    setShowSnackbar(true);
  };

  // ✅ Close the Snackbar after a while
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <>
      <AnimatePresence>
        <List>
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <ListItem
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  borderBottom: "1px solid #eee",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  padding: "10px",
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
                      onChange={() => handleCheckboxChange(goal)}
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

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleToggleCalendarVisibility(goal.id)}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <FaListAlt style={{ marginRight: 4 }} /> History
                    </Button>

                    {deleteMode && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleOpenModal(goal)}
                        size="small"
                      >
                        Delete
                      </Button>
                    )}
                  </Box>
                </Box>

                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mt: 0.5 }}
                >
                  Streak: {calculateStreak(goal)}
                </Typography>

                <Collapse
                  in={visibleCalendars[goal.id] || false}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box sx={{ mt: 2, width: "100%" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateCalendar
                        disableFuture
                        slots={{
                          day: (props) => (
                            <DayRenderer
                              {...props}
                              history={goal.history}
                              value={props.value}
                            />
                          ),
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                </Collapse>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </AnimatePresence>

      {/* ✅ Snackbar Notification */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={alertSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this goal? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteGoal(selectedGoal.id); // <-- Call the delete function
              handleCloseModal();
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GoalList;
