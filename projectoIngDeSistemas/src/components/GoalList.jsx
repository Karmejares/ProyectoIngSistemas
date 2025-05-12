import React, { useState } from "react";
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
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { FaListAlt } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import DayRenderer from "./DayRenderer"; // ✅ Import DayRenderer
import dayjs from "dayjs";

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

  // ✅ Confirm Deletion
  const handleConfirmDelete = async () => {
    if (selectedGoal) {
      await handleDeleteGoal(selectedGoal.id);
      handleCloseModal();
    }
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
                {/* Goal Information */}
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

                {/* ✅ Calendar Collapse */}
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

      {/* ✅ Confirmation Modal */}
      <Dialog
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Goal?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the goal:{" "}
            <strong>{selectedGoal?.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GoalList;
