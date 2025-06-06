import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";

function LogIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [error, setError] = useState("");
  const { logInUser } = useContext(UserContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const responseData = await response.json();
      logInUser(responseData.token);
      navigate("/Application");
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#e6f1f5", // soft blue
        padding: 3,
      }}
    >
      <Box
        sx={{
          width: 300,
          padding: 3,
          borderRadius: 2,
          boxShadow: 0,
          backgroundColor: "#e6f1f5", // clean white card
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            textAlign: "center",
            color: "#4a9c8c", // calm muted green
            fontWeight: 600,
          }}
        >
          Log In
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Username"
            type="text"
            fullWidth
            margin="normal"
            error={!!errors.username}
            helperText={errors.username?.message}
            {...register("username", { required: "Username is required" })}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
            })}
          />

          <Button
            type="submit"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#6bb5a2", // muted green
              color: "#fff",
              "&:hover": {
                backgroundColor: "#5aa492",
              },
            }}
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
          Don&#39;t have an account?{" "}
          <Link
            to="/SignUp"
            style={{ textDecoration: "none", color: "#4a9c8c" }} // deeper green
          >
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default LogIn;
