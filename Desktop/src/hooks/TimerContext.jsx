import { createContext, useState, useEffect } from "react";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const [countdown, setCountdown] = useState(null);

  // ✅ Load initial time from localStorage
  useEffect(() => {
    const savedTime = localStorage.getItem("remainingTime");
    if (savedTime) {
      setRemainingTime(parseInt(savedTime));
    }
  }, []);

  useEffect(() => {
    if (remainingTime !== null) {
      localStorage.setItem("remainingTime", remainingTime);
    }
  }, [remainingTime]);

  useEffect(() => {
    if (remainingTime !== null && remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            clearInterval(interval);
            localStorage.removeItem("remainingTime");
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      setCountdown(interval);

      return () => clearInterval(interval);
    }
  }, [remainingTime]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <TimerContext.Provider
      value={{
        remainingTime,
        setRemainingTime,
        formatTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
