const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User"); // Import the User model

// 🔑 Secret key for JWT (stored in environment variable)
const SECRET_KEY = process.env.JWT_SECRET;

// ✅ Register (Sign Up)
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 🔍 Check if the user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    // 🔒 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create a new user in MongoDB
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      coins: 100, // Optional: Initialize with 100 coins
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "User created" });
  } catch (error) {
    console.error("❌ Error during signup:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // 🔍 Find user in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔒 Compare the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // ✅ Send token and user info
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        username: user.username,
        email: user.email,
        coins: user.coins,
      },
    });
  } catch (error) {
    console.error("❌ Error during login:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ✅ Get Profile (Protected Route)

router.get("/profile", async (req, res) => {
  try {
    console.log("🔍 Incoming request to /profile");

    // 🔐 Get token from headers
    console.log("🔐 Authorization Header:", req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      console.error("❌ No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    // 🔓 Verify token and extract user ID
    console.log("🔓 Verifying token...");
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("✅ Token decoded:", decoded);

    if (!decoded.id) {
      console.error("❌ Invalid token format");
      return res.status(401).json({ message: "Invalid token" });
    }

    // 🔍 Find the user in the database
    console.log("🔍 Looking for user with ID:", decoded.id);
    const user = await User.findById(decoded.id);

    if (!user) {
      console.warn("⚠️ User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Return the user information
    console.log("✅ User found:", user.username);
    res.status(200).json({
      username: user.username,
      email: user.email,
      coins: user.coins,
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
