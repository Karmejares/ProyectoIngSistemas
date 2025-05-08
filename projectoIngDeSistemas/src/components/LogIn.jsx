import React, { useState, useContext } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { TextField, Button } from "@mui/material";
 
function LogIn() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { users, logInUser } = useContext(UserContext); // Access logInUser from context
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

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

      if (response.status === 200) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("token", token);
        logInUser()
        navigate("/Application");
        
      }
    } catch (err) {
      setError(err.message);
      console.log(err.message)
    }
  };
  
  // const userExists = users.some(
  //   (user) =>
  //     user.username === formData.username &&
  //     user.password === formData.password
  // );
  
  
  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <TextField
 label="Username"
 type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
 fullWidth
 margin="normal"
          />
          <TextField
 label="Password"
 type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
 fullWidth
 margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">Sign In</Button>
        </form>
        {error && <p>{error}</p>}
        <div>
          <Link to="/SignUp">Don't have an account? Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default LogIn;

