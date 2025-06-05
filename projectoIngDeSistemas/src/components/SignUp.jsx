import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  FormHelperText,
} from "@mui/material";

function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (data) => {
    setServerError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:3001/api/usuarios/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.username,
            password: data.password,
            email: data.email,
          }),
        },
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Signup failed");
      }

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Error during signup:", err.message);
      setServerError(err.message);
    }
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

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          error={!!errors.username}
          {...register("username", {
            required: {
              value: true,
              message: "Username is required",
            },
            minLength: {
              value: 2,
              message: "Username must be at least 2 characters",
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message:
                "Username can only contain letters, numbers and underscores",
            },
          })}
        />
        {errors.username && (
          <FormHelperText error>{errors.username.message}</FormHelperText>
        )}

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          error={!!errors.email}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
              message: "Invalid email format",
            },
          })}
        />
        {errors.email && (
          <FormHelperText error>{errors.email.message}</FormHelperText>
        )}

        <TextField
          label="Date of Birth"
          type="date"
          fullWidth
          margin="normal"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          {...register("dob", {
            required: {
              value: true,
              message: "Please enter a date",
            },
            validate: (value) => {
              const birthDate = new Date(value);
              const today = new Date();
              const age = today.getFullYear() - birthDate.getFullYear();
              const m = today.getMonth() - birthDate.getMonth();

              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                return age - 1 >= 21 || "Must be at least 21 years old";
              }

              return age >= 21 || "Must be at least 21 years old";
            },
          })}
        />
        {errors.dob && (
          <FormHelperText error>{errors.dob.message}</FormHelperText>
        )}
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          error={!!errors.password}
          {...register("password", {
            required: {
              value: true,
              message: "Password is required",
            },
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/,
              message:
                "Password must be at least 6 characters and include at least one uppercase letter, one lowercase letter, one number, and one of the following symbols: @ $ ! % * ? & #. Other special characters are not allowed.",
            },
          })}
        />
        {errors.password && (
          <FormHelperText error>{errors.password.message}</FormHelperText>
        )}

        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          error={!!errors.confirmPassword}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && (
          <FormHelperText error>
            {errors.confirmPassword.message}
          </FormHelperText>
        )}

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

      {serverError && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {serverError}
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
        onClick={() => navigate("/")}
        fullWidth
        sx={{ mt: 2 }}
      >
        Back to Log In
      </Button>
    </Box>
  );
}

export default SignUp;
