import { useState } from "react";
import axios from "axios";

export function useOptionsMenu({ logOutUser, username, token, navigate }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL =
    import.meta.env && import.meta.env.MODE === "development"
      ? "http://localhost:3001/api/auth"
      : "https://proyectoingsistemas-3.onrender.com/api/auth";

  const OPTIONS_URL =
    import.meta.env && import.meta.env.MODE === "development"
      ? "http://localhost:3001/api/options"
      : "https://proyectoingsistemas-3.onrender.com/api/options";

  const handleLogout = () => {
    alert("You are now logged out!");
    logOutUser();
    navigate("/");
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      axios
        .delete(`${OPTIONS_URL}/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          alert("Your account has been deleted.");
          logOutUser();
          navigate("/");
        })
        .catch((error) => console.error("Error deleting account:", error));
    }
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
        `${API_URL}/changePassword`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
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

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setPasswordError("");
    setPasswordSuccess("");
  };

  return {
    // states
    showPasswordModal,
    currentPassword,
    newPassword,
    passwordError,
    passwordSuccess,
    loading,

    // setters
    setShowPasswordModal,
    setCurrentPassword,
    setNewPassword,

    // handlers
    handleLogout,
    handleDeleteAccount,
    handleChangePassword,
    handleClosePasswordModal,
  };
}
