const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔑 Secret key for JWT (stored in environment variable)
const SECRET_KEY = process.env.JWT_SECRET;

/**
 * ✅ Register (Sign Up)
 */
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 🔍 Check if the user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // 🔒 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create a new user in MongoDB
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      coins: 50, // 🪙 Initialize with 50 coins
    });

    await newUser.save();

    // ✅ Generate a JWT token for immediate login after sign-up
    const token = jwt.sign(
      {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // ✅ Send response with token and user info
    res.status(201).json({
      success: true,
      message: "User created",
      token: token,
      user: {
        username: newUser.username,
        email: newUser.email,
        coins: newUser.coins,
      },
    });
  } catch (error) {
    console.error("❌ Error during signup:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * ✅ Login
 */
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

/**
 * ✅ Update Coins (Protected Route)
 * Expects: { coins: number }
 */
router.post("/updateCoins", authMiddleware, userController.updateCoins);

/**
 * ✅ Get Profile (Protected Route)
 */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // `authMiddleware` already sets `req.user`, no need to manually extract token
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Return the user information
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
