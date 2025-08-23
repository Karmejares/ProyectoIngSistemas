// TimerContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const [countdown, setCountdown] = useState(null);

  // Load initial time from AsyncStorage
  useEffect(() => {
    const loadSavedTime = async () => {
      try {
        const savedTime = await AsyncStorage.getItem("remainingTime");
        if (savedTime) {
          setRemainingTime(parseInt(savedTime));
        }
      } catch (error) {
        console.error("Error loading saved time:", error);
      }
    };

    loadSavedTime();
  }, []);

  // Save time to AsyncStorage on change
  useEffect(() => {
    const saveTime = async () => {
      try {
        if (remainingTime !== null) {
          await AsyncStorage.setItem("remainingTime", remainingTime.toString());
        }
      } catch (error) {
        console.error("Error saving time:", error);
      }
    };

    saveTime();
  }, [remainingTime]);

  // Timer logic
  useEffect(() => {
    if (remainingTime !== null && remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            clearInterval(interval);
            AsyncStorage.removeItem("remainingTime").catch(console.error);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      setCountdown(interval);

      return () => clearInterval(interval);
    }
  }, [remainingTime]);

  // Format time
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
