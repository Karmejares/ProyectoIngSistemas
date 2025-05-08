import React, { useState, useContext } from "react";
import { UserContext } from "./UserContext"; // Import UserContext
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { TextField, Button, Typography, Box } from "@mui/material";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { addUser } = useContext(UserContext); // Access the addUser function from context
  const navigate = useNavigate(); // Initialize navigation

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    // Make the fetch call to /auth/signup
    fetch("http://localhost:3001/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || "Signup failed");
        }
        const data = await response.json();
        return { response, data };
      })
      .then(({ response, data }) => {
        if (response.status === 200) {
          navigate("/");
        }
      })
      .catch((err) => {
        // Handle errors
        console.error("Error during signup:", err);
        setError(err.message);
        setSuccess("");
      });

    setFormData({
      username: "",
      email: "",
      dob: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleBackToLogin = () => {
    navigate("/"); // Navigate back to the login page
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date of Birth"
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </form>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
          {success}
        </Typography>
      )}
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleBackToLogin}
        fullWidth
        sx={{ mt: 2 }}
      >
        Back to Log In
      </Button>
    </Box>
  );
}

export default SignUp;
