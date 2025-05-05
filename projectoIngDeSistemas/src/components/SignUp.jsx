import React, { useState, useContext } from "react";
import { UserContext } from "./UserContext"; // Import UserContext
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import styles from "./SignUp.module.css";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    dob: "", // Add date of birth to the formData state
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
    fetch("http://localhost:3001/auth/signup", {
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
          const err = await response.json()
          throw new Error(err.message || "Signup failed");
        }
        const data = await response.json()
        return { response, data }
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
    <div className={styles.container}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
        />
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
        />
        <button type="submit">Register</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <button className={styles.backButton} onClick={handleBackToLogin}>
        Back to Log In
      </button>
    </div>
  );
}

export default SignUp;
