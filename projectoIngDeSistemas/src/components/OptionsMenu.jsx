import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import classes from "./OptionsMenu.module.css";
import axios from "axios";
import { TimerContext } from "./TimerContext";

function OptionsMenu() {
  const navigate = useNavigate();
  const { isLoggedIn, logOutUser, username } = useContext(UserContext);

  const [timeLimit, setTimeLimit] = useState(0); // Minutes
  const [timeExceeded, setTimeExceeded] = useState(false);
  const [countdown, setCountdown] = useState(null);
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
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      setCountdown(countdownInterval);
      return () => clearInterval(countdownInterval);
    }
  }, [remainingTime]);

  // ✅ Trigger alert when time is up
  useEffect(() => {
    if (timeExceeded) {
      alert("Time limit exceeded! Please take a break.");
      setTimeExceeded(false); // Reset after alert
    }
  }, [timeExceeded]);

  // ✅ Handle Timer Setting
  const handleSetTimeLimit = (e) => {
    const minutes = parseInt(e.target.value) || 0;
    setTimeLimit(minutes);

    // 🔄 Convert to milliseconds and update both local and global state
    const milliseconds = minutes * 60 * 1000;
    setRemainingTime(milliseconds); // <-- This updates the global context

    if (username) {
      console.log(
        `🔥 Sending PUT to /api/options/${username} with timeLimit: ${minutes}`
      );

      axios
        .put(`http://localhost:3001/api/options/${username}`, {
          timeLimit: minutes,
        })
        .then((response) => {
          console.log("✅ Time limit updated in the database:", response.data);
        })
        .catch((error) => {
          console.error("❌ Error updating time limit:", error.message);
          if (error.response) {
            console.error("❌ Backend response:", error.response.data);
          }
        });
    } else {
      console.error("❌ Username not found in context.");
    }
  };

  // ✅ Logout function
  const handleLogout = () => {
    alert("You are now logged out!");
    logOutUser();
    navigate("/");
  };

  // ✅ Delete Account Handler
  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      axios
        .delete(`http://localhost:3001/api/options/${username}`)
        .then(() => {
          alert("Your account has been deleted.");
          logOutUser();
          navigate("/");
        })
        .catch((error) => console.error("Error deleting account:", error));
    }
  };

  return (
    <div className={classes.menuContainer}>
      <h2>Options Menu</h2>
      <ul className={classes.menuList}>
        <li>
          <button onClick={handleLogout} className={classes.menuButton}>
            Log Out
          </button>
        </li>
        <li>
          <div className={classes.timeLimitContainer}>
            <label htmlFor="timeLimit" className={classes.label}>
              Set Timer (Minutes):
            </label>
            <input
              type="number"
              id="timeLimit"
              value={timeLimit}
              onChange={handleSetTimeLimit}
              className={classes.timeInput}
              placeholder="Minutes"
            />
            {remainingTime !== null && (
              <p>Time Remaining: {formatTime(remainingTime)}</p>
            )}
          </div>
        </li>
        <li>
          <button onClick={handleDeleteAccount} className={classes.menuButton}>
            Delete Account
          </button>
        </li>
        <li>
          <button className={classes.menuButton}>Change Password</button>
        </li>
        <li>
          <button className={classes.menuButton}>Privacy Settings</button>
        </li>
        <li>
          <button className={classes.menuButton}>View Profile</button>
        </li>
      </ul>
    </div>
  );
}

export default OptionsMenu;
