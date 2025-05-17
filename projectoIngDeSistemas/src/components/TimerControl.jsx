import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { TimerContext } from "./TimerContext";
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";

const TimerControl = ({ username }) => {
  const [timeLimit, setTimeLimit] = useState(0); // Minutes
  const [timeExceeded, setTimeExceeded] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { remainingTime, setRemainingTime, formatTime } =
    useContext(TimerContext);

  // ✅ Fetch time limit from the server when the component mounts
  useEffect(() => {
    if (username) {
      axios
        .get(`http://localhost:3001/api/options/${username}`)
        .then((response) => {
          if (response.data && response.data.timeLimit) {
            setTimeLimit(response.data.timeLimit);
            const savedTime = localStorage.getItem("remainingTime");
            if (savedTime) {
              setRemainingTime(parseInt(savedTime));
            } else {
              const milliseconds = response.data.timeLimit * 60 * 1000;
              setRemainingTime(milliseconds);
            }
          }
        })
        .catch((error) => console.error("Error fetching time limit:", error));
    }
  }, [username]);

  // ✅ Save the timer in localStorage to persist state on modal close
  useEffect(() => {
    if (remainingTime !== null) {
      localStorage.setItem("remainingTime", remainingTime);
    }
  }, [remainingTime]);

  // ✅ Countdown Timer Logic
  useEffect(() => {
    if (remainingTime !== null && remainingTime > 0) {
      const countdownInterval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            clearInterval(countdownInterval);
            localStorage.removeItem("remainingTime");
            setTimeExceeded(true);
            setOpenSnackbar(true); // ✅ Show Snackbar
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(countdownInterval); // ✅ Cleanup properly
    }
  }, []); // ✅ Empty dependency array, runs once

  // ✅ Handle Timer Setting
  const handleSetTimeLimit = (e) => {
    const minutes = parseInt(e.target.value) || 0;
    setTimeLimit(minutes);

    // 🔄 Convert to milliseconds and update both local and global state
    const milliseconds = minutes * 60 * 1000;
    setRemainingTime(milliseconds);

    if (username) {
      axios
        .put(`http://localhost:3001/api/options/${username}`, {
          timeLimit: minutes,
        })
        .then((response) => {
          console.log("✅ Time limit updated in the database:", response.data);
        })
        .catch((error) => {
          console.error("❌ Error updating time limit:", error.message);
        });
    } else {
      console.error("❌ Username not found in context.");
    }
  };

  // ✅ Handle Snackbar Close
  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  // ✅ Calculate percentage for progress
  const percentage =
    remainingTime !== null && timeLimit > 0
      ? (remainingTime / (timeLimit * 60 * 1000)) * 100
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Stack
        direction="column"
        spacing={2}
        sx={{ alignItems: "center", justifyContent: "center", mt: 2 }}
      >
        <TextField
          label="Set Timer (Minutes)"
          type="number"
          variant="outlined"
          value={timeLimit}
          onChange={handleSetTimeLimit}
          sx={{ width: "150px" }}
        />

        <Box
          sx={{
            position: "relative",
            display: "inline-flex",
          }}
        >
          <CircularProgress
            variant="determinate"
            value={percentage}
            size={120}
            color="success"
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6">
              {remainingTime !== null ? formatTime(remainingTime) : "00:00"}
            </Typography>
          </Box>
        </Box>
      </Stack>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{ width: "100%" }}
        >
          ⏰ Time limit exceeded! Please take a break.
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default TimerControl;
