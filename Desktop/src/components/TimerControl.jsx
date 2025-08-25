import React from "react";
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
import { useTimerControl } from "../hooks/useTimerControl";

const TimerControl = ({ username }) => {
  const {
    timeLimit,
    handleSetTimeLimit,
    openSnackbar,
    handleCloseSnackbar,
    remainingTime,
    formatTime,
    percentage,
  } = useTimerControl(username);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Stack
        direction="column"
        spacing={2}
        sx={{ alignItems: "center", mt: 2 }}
      >
        <TextField
          label="Set Timer (Minutes)"
          type="number"
          value={timeLimit}
          onChange={(e) => handleSetTimeLimit(e.target.value)}
          sx={{ width: "150px" }}
        />

        <Box sx={{ position: "relative", display: "inline-flex" }}>
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
