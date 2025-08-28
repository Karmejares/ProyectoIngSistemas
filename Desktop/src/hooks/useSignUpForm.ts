import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function useSignUpForm() {
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

  const onSubmit = async (data: any) => {
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
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Signup failed");
      }

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      console.error("Error during signup:", err.message);
      setServerError(err.message);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    password,
    serverError,
    success,
    navigate,
  };
}
