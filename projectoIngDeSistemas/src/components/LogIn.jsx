import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";

function LogIn() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { logInUser } = useContext(UserContext); // Access logInUser from context
  const navigate = useNavigate();

  // ✅ Handle form input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      // ✅ Successful login
      const data = await response.json();
      const token = data.token;

      // ✅ Update context and store token
      logInUser(token); // Pass the token to the context
      navigate("/Application"); // Redirect to the application page
    } catch (err) {
      setError(err.message);
      console.log("Login error:", err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f3f4f6",
        padding: 3,
      }}
    >
      <Box
        sx={{
          width: 300,
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          Log In
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Log In
          </Button>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Don't have an account?{" "}
          <Link
            to="/SignUp"
            style={{ textDecoration: "none", color: "#1976d2" }}
          >
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default LogIn;
