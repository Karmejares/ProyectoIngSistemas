import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import classes from "./OptionsMenu.module.css";

function OptionsMenu() {
  const navigate = useNavigate();
  
  const userId = currentUser?.id;
  const { currentUser, logOutUser } = useContext(UserContext); // Usamos currentUser en lugar de users[]
  const [timeLimit, setTimeLimit] = useState("");
  const [timeExceeded, setTimeExceeded] = useState(false);
  
  
  const handleLogout = () => {
    alert("You are now logged out!");
    logOutUser();
    navigate("/");
  };
  
  const handleSetTimeLimit = async (e) => {
    const newTime = e.target.value;
    setTimeLimit(newTime);
    
    try {
      const response = await fetch("http://localhost:8000/api/user/update-time-limit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, timeLimit: newTime }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update");
      alert("Time limit updated!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating time limit.");
    }
  };
  
  
  const handleChangePassword = async () => {
    const newPassword = prompt("Enter new password:");
    console.log("Datos enviados:", { userId, newPassword });

    try {
      const response = await fetch("http://localhost:8000/api/usuarios/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      alert("Password changed successfully.");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to change password.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      const response = await fetch("http://localhost:8000/api/user/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      logOutUser();
      alert("Account deleted.");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete account.");
    }
  };

  const handlePrivacySettings = async () => {
    const newPrivacy = prompt("Enter privacy setting (e.g., 'public' or 'private'):");
    if (!newPrivacy) return;

    try {
      const response = await fetch("http://localhost:8000/api/user/update-privacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, privacy: newPrivacy }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      alert("Privacy settings updated.");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update privacy.");
    }
  };

  const handleHelpSupport = () => {
    alert("Redirecting to Help & Support...");
  };

  const handleAboutApp = () => {
    alert("This app is designed to help you manage your goals and time effectively!");
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

      return () => clearInterval(checkTime);
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
          <button onClick={handleLogout} className={classes.menuButton}>Log Out</button>
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
          <button onClick={handlePrivacySettings} className={classes.menuButton}>
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
