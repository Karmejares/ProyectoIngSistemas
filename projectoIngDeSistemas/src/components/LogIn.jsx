import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import classes from "./LogIn.module.css";

function LogIn() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { users, logInUser } = useContext(UserContext); // Access logInUser from context
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const userExists = users.some(
      (user) =>
        user.username === formData.username &&
        user.password === formData.password
    );
    if (userExists) {
      logInUser(); // Mark the user as logged in
      navigate("/Application"); // Redirect to the application page
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className={classes.body}>
      <div className={classes.loginContainer}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Sign In</button>
        </form>
        {error && <p className={classes.error}>{error}</p>}
        <div className={classes.linkContainer}>
          <Link to="/SignUp">Don't have an account? Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
