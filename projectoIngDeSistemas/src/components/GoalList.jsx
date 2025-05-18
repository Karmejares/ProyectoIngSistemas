import { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { removeGoal, fetchGoals } from "../redux/goalsSlice";
import {
  addTenCoins,
  removeTenCoins,
  updateCoinsOnServer,
} from "../redux/coinsSlice";
import axios from "axios";

const GoalList = ({
  deleteMode,
  handleToggleGoal,
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
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.coins.amount);
  const goals = useSelector((state) => state.goals?.items || []);

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

  // ✅ Handle Checkbox change (Add or Remove 10 Coins using Redux)
  const handleCheckboxChange = (goal) => {
    //console.log("Goal object received:", goal); // Check the full object
    //console.log("Goal ID:", goal._id); // Check if _id is actually present
    if (!handleToggleGoal) {
      //console.error("❌ handleToggleGoal is not passed from parent!");
      return;
    }

    // Trigger the toggle logic
    handleToggleGoal(goal._id);

    const today = new Date().toISOString().slice(0, 10);

    if (goal.history.includes(today)) {
      // ✅ Unchecked => Remove 10 Coins
      dispatch(removeTenCoins());
      dispatch(updateCoinsOnServer({ amount: coins - 10, token }));
      setSnackbarMessage("💔 10 Coins Removed!");
      setAlertSeverity("error");
    } else {
      // ✅ Checked => Add 10 Coins
      dispatch(addTenCoins());
      dispatch(updateCoinsOnServer({ amount: coins + 10, token }));
      setSnackbarMessage("🎉 10 Coins Added!");
      setAlertSeverity("success");
    }
    setShowSnackbar(true);
  };

  // ✅ Close the Snackbar after a while
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  // ✅ Handle Delete Goal
  const handleDeleteGoal = async (goalId) => {
    const token = localStorage.getItem("token");

    try {
      console.log(`Attempting to delete goal: ${goalId}`);

      // Send delete request to the backend
      await axios.delete(`http://localhost:3001/api/goals/${goalId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("🗑️ Goal deleted successfully!");

      // ✅ Refetch the goals from the backend
      dispatch(fetchGoals());

      setSnackbarMessage("🗑️ Goal Removed!");
      setAlertSeverity("info");
      setShowSnackbar(true);
    } catch (error) {
      console.error("❌ Error removing goal:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  // ✅ Fetch goals when component mounts
  useEffect(() => {
    dispatch(fetchGoals()).then((response) => {
      console.log("Goals fetched from Redux state:", response.payload);
    });
  }, [dispatch]);

  return (
    <>
      <AnimatePresence>
        <List>
          {goals.length > 0 ? (
            goals.map((goal) => (
              <motion.div
                key={goal._id}
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
                        checked={
                          goal.history?.includes(
                            new Date().toISOString().slice(0, 10)
                          ) ?? false
                        }
                        onChange={() => handleCheckboxChange(goal)}
                        disabled={deleteMode}
                      />
                      {/* {console.log("Current Goal Object:", goal)}
                      {console.log("History Field:", goal.history)} */}
                      <Typography
                        variant="body1"
                        sx={{
                          textDecoration: goal.history?.includes(
                            new Date().toISOString().slice(0, 10)
                          )
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {goal.title}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => toggleCalendarVisibility(goal._id)}
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
                    in={visibleCalendars[goal._id] || false}
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
            ))
          ) : (
            <Typography variant="subtitle1" color="textSecondary">
              No goals found. Try adding a new goal!
            </Typography>
          )}
        </List>
      </AnimatePresence>

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
              handleDeleteGoal(selectedGoal._id);
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
