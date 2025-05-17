import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import classes from "./OptionsMenu.module.css";
import axios from "axios";
import TimerControl from "./TimerControl";

function OptionsMenu() {
  const navigate = useNavigate();
  const { isLoggedIn, logOutUser, username, token } = useContext(UserContext);

  // ✅ State for Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

  // ✅ Change Password Handlers
  const handleOpenPasswordModal = () => setShowPasswordModal(true);
  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/changePassword",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setPasswordSuccess("Password updated successfully!");
        setTimeout(() => handleClosePasswordModal(), 1500);
      }
    } catch (error) {
      console.error("❌ Error updating password:", error.message);
      setPasswordError("Failed to update password. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render Password Modal
  const renderPasswordModal = () => (
    <div className={classes.modalOverlay}>
      <div className={classes.modalContent}>
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={classes.modalInput}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={classes.modalInput}
        />
        {passwordError && <p className={classes.error}>{passwordError}</p>}
        {passwordSuccess && (
          <p className={classes.success}>{passwordSuccess}</p>
        )}
        <button onClick={handleChangePassword} className={classes.modalButton}>
          Update Password
        </button>
        <button
          onClick={handleClosePasswordModal}
          className={classes.modalButton}
        >
          Cancel
        </button>
      </div>
    </div>
  );
  return (
    <div className={classes.menuContainer}>
      <h2>Options Menu</h2>
      <ul className={classes.menuList}>
        <button onClick={handleLogout} className={classes.menuButton}>
          Log Out
        </button>
        <li>
          <TimerControl username={username} />
        </li>
        <li>
          <button onClick={handleDeleteAccount} className={classes.menuButton}>
            Delete Account
          </button>
        </li>
        <li>
          <button
            onClick={handleOpenPasswordModal}
            className={classes.menuButton}
          >
            Change Password
          </button>
        </li>
        <li>
          <button className={classes.menuButton}>Privacy Settings</button>
        </li>
        <li>
          <button className={classes.menuButton}>View Profile</button>
        </li>
      </ul>

      {/* Render the password modal if it's open */}
      {showPasswordModal && renderPasswordModal()}
    </div>
  );
}

export default OptionsMenu;
