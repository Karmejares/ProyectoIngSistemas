import { useState } from "react";
import {
  ListItem,
  Box,
  Checkbox,
  Typography,
  Button,
  Collapse,
  Snackbar,
  Alert,
  List,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { FaListAlt } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import DayRenderer from "./DayRenderer";
import { useDispatch, useSelector } from "react-redux";

import {
  addTenCoins,
  removeTenCoins,
  updateCoinsOnServer,
} from "../redux/coinsSlice";
import Modal from "@mui/material/Modal";
import useModalManager from "../hooks/useModalManager";

import GoalDetails from "./GoalDetails"; // Import the new GoalDetails component
const GoalList = ({
  handleToggleGoal,
  toggleCalendarVisibility,
  visibleCalendars,
  calculateStreak,
}) => {
  const { open, close, activeModal, modalProps } = useModalManager();
  const [selectedGoal, setSelectedGoal] = useState(null); // Used for delete modal// State for delete modal
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false); // State for edit modal
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.coins.amount);
  const goals = useSelector((state) => state.goals?.items || []);

  const handleCheckboxChange = (goal) => {
    console.log("Goal ID:", goal._id); // Check if _id is actually present
    if (!handleToggleGoal) {
      return;
    }
    handleToggleGoal(goal._id);

    const today = new Date().toISOString().slice(0, 10);

    if (goal.history.includes(today)) {
      dispatch(removeTenCoins());
      dispatch(updateCoinsOnServer({ amount: coins - 10, token }));
      setSnackbarMessage("💔 10 Coins Removed!");
      setAlertSeverity("error");
    } else {
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

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal); // Set the goal to be edited
    setOpenEditModal(true); // Open the edit modal
  };

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
                    backgroundColor: "#ffffff",
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
                        onClick={() => open("detailsModal", { goal })}
                        sx={{
                          backgroundColor: "#6bb5a2",
                          color: "#ffffff",
                          "&:hover": {
                            backgroundColor: "#5da894",
                          },
                        }}
                      >
                        Details
                      </Button>
                      <Button
                        size="small"
                        onClick={() => toggleCalendarVisibility(goal._id)}
                        sx={{
                          backgroundColor: "#6bb5a2",
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          "&:hover": {
                            backgroundColor: "#5da894",
                          },
                        }}
                      >
                        <FaListAlt style={{ marginRight: 4 }} /> History
                      </Button>
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
      <Modal
        open={activeModal === "detailsModal"}
        onClose={close}
        aria-labelledby="goal-details-modal-title"
        aria-describedby="goal-details-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#e6f1f5", // azul suave
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          {/*{console.log("Selected Goal ID:", selectedGoal?._id)}*/}
          {modalProps?.goal && (
            <GoalDetails
              goalId={modalProps.goal._id}
              onClose={close}
              onEdit={handleEditGoal}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default GoalList;
