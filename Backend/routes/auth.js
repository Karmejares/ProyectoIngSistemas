const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const jwt = require("jsonwebtoken");

const router = express.Router();
const usersFilePath = path.join(__dirname, "../data/usuarios.json");

// Secret key for JWT (in a real app, keep it in environment variables)
const SECRET_KEY = "your_secret_key";

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const fileData = await fs.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(fileData);

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // ✅ Generate JWT token
      const token = jwt.sign(
        {
          username: user.username,
          email: user.email,
        },
        SECRET_KEY,
        { expiresIn: "1h" } // Token expires in 1 hour
      );

      // ✅ Send token to the frontend
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const fileData = await fs.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(fileData);

    const userExists = users.some((u) => u.username === username);

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }
    users.push({ username, email, password });

    await fs.writeFile(usersFilePath, JSON.stringify(users));
    res.status(200).json({ success: true, message: "User created" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
