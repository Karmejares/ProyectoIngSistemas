import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { TimerContext } from "./TimerContext";

export const useTimerControl = (username) => {
  const [timeLimit, setTimeLimit] = useState(0); // en minutos
  const [timeExceeded, setTimeExceeded] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { remainingTime, setRemainingTime, formatTime } =
    useContext(TimerContext);

  // 🔹 Cargar límite desde backend
  useEffect(() => {
    if (username) {
      axios
        .get(`http://localhost:3001/api/options/${username}`)
        .then((response) => {
          if (response.data?.timeLimit) {
            setTimeLimit(response.data.timeLimit);
            const savedTime = localStorage.getItem("remainingTime");
            if (savedTime) {
              setRemainingTime(parseInt(savedTime));
            } else {
              setRemainingTime(response.data.timeLimit * 60 * 1000);
            }
          }
        })
        .catch((error) =>
          console.error("❌ Error fetching time limit:", error)
        );
    }
  }, [username]);

  // 🔹 Guardar estado en localStorage
  useEffect(() => {
    if (remainingTime !== null) {
      localStorage.setItem("remainingTime", remainingTime);
    }
  }, [remainingTime]);

  // 🔹 Lógica del countdown
  useEffect(() => {
    if (remainingTime !== null && remainingTime > 0) {
      const countdownInterval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            clearInterval(countdownInterval);
            localStorage.removeItem("remainingTime");
            setTimeExceeded(true);
            setOpenSnackbar(true);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, []); // solo una vez

  // 🔹 Setear nuevo límite
  const handleSetTimeLimit = (minutes) => {
    const value = parseInt(minutes) || 0;
    setTimeLimit(value);

    const ms = value * 60 * 1000;
    setRemainingTime(ms);

    if (username) {
      axios
        .put(`http://localhost:3001/api/options/${username}`, {
          timeLimit: value,
        })
        .then((res) => console.log("✅ Time updated:", res.data))
        .catch((err) =>
          console.error("❌ Error updating time limit:", err.message)
        );
    }
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  // porcentaje circular
  const percentage =
    remainingTime !== null && timeLimit > 0
      ? (remainingTime / (timeLimit * 60 * 1000)) * 100
      : 0;

  return {
    timeLimit,
    setTimeLimit,
    timeExceeded,
    openSnackbar,
    handleSetTimeLimit,
    handleCloseSnackbar,
    remainingTime,
    formatTime,
    percentage,
  };
};
