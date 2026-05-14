const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/signup", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // 🔎 Find the user by ID, which is set in the middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Return the user information with proper defaults
    res.status(200).json({
      username: user.username,
      email: user.email,
      coins: user.coins ?? 50, // 🪙 Fallback to 50 if undefined or null
      timeLimit: user.timeLimit ?? 0, // 🕒 Fallback to 0 if not set
      privacy: user.privacy ?? false, // 🔒 Fallback to false if not set
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/updateCoins", authMiddleware, userController.updateCoins);

router.post("/updateTimeLimit", authMiddleware, userController.updateTimeLimit);

router.post("/updatePrivacy", authMiddleware, userController.updatePrivacy);

router.post("/changePassword", authMiddleware, userController.changePassword);

router.delete("/deleteAccount", authMiddleware, userController.deleteAccount);

module.exports = router;
