import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./OptionsMenu.module.css";

function OptionsMenu() {
  const navigate = useNavigate();
  const [timeLimit, setTimeLimit] = useState(""); // State to store the time limit
  const [timeExceeded, setTimeExceeded] = useState(false); // State to track if time is exceeded

  const handleLogout = () => {
    alert("You are now logged out!");
    navigate("/"); // Redirect to the LogInBckgrd component
  };

  const handleSetTimeLimit = (e) => {
    setTimeLimit(e.target.value);
  };

  const handleChangePassword = () => {
    alert("Redirecting to Change Password page...");
    // Add navigation or modal logic for changing password
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      alert("Your account has been deleted.");
      navigate("/"); // Redirect to the login page after account deletion
    }
  };

  const handlePrivacySettings = () => {
    alert("Redirecting to Privacy Settings...");
    // Add navigation or modal logic for privacy settings
  };

  const handleHelpSupport = () => {
    alert("Redirecting to Help & Support...");
    // Add navigation or modal logic for help and support
  };

  const handleAboutApp = () => {
    alert(
      "This app is designed to help you manage your goals and time effectively!"
    );
  };

  useEffect(() => {
    if (timeLimit) {
      const [hours, minutes] = timeLimit.split(":").map(Number);
      const limitTime = new Date();
      limitTime.setHours(hours, minutes, 0);

      const checkTime = setInterval(() => {
        const currentTime = new Date();
        if (currentTime > limitTime) {
          setTimeExceeded(true);
          clearInterval(checkTime);
        }
      }, 1000);

      return () => clearInterval(checkTime); // Cleanup interval on component unmount
    }
  }, [timeLimit]);

  useEffect(() => {
    if (timeExceeded) {
      alert("Time limit exceeded! Please take a break.");
    }
  }, [timeExceeded]);

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
              Set Time Limit (HH:MM):
            </label>
            <input
              type="time"
              id="timeLimit"
              value={timeLimit}
              onChange={handleSetTimeLimit}
              className={classes.timeInput}
            />
          </div>
        </li>
        <li>
          <button onClick={handleChangePassword} className={classes.menuButton}>
            Change Password
          </button>
        </li>
        <li>
          <button onClick={handleDeleteAccount} className={classes.menuButton}>
            Delete Account
          </button>
        </li>
        <li>
          <button
            onClick={handlePrivacySettings}
            className={classes.menuButton}
          >
            Privacy Settings
          </button>
        </li>
        <li>
          <button onClick={handleHelpSupport} className={classes.menuButton}>
            Help & Support
          </button>
        </li>
        <li>
          <button onClick={handleAboutApp} className={classes.menuButton}>
            About the App
          </button>
        </li>
      </ul>
    </div>
  );
}

export default OptionsMenu;
