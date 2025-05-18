// routes/pet.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Update Last Fed Time
router.put("/feed", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.lastFed = new Date();
    await user.save();

    res.status(200).json({ lastFed: user.lastFed });
  } catch (error) {
    console.error("❌ Error updating last fed time:", error.message);
    res.status(500).json({ message: "Server Error" });
  } // <-- This was previously broken
});

// ✅ Fetch Hunger Status
router.get("/hunger", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentTime = new Date();
    const lastFed = new Date(user.lastFed);
    const hoursPassed = Math.floor((currentTime - lastFed) / 1000 / 3600);

    // Assuming every 3 hours increases hunger by 25%
    const hungerLevel = Math.min(hoursPassed * 25, 100);

    res.status(200).json({ hungerLevel, lastFed });
  } catch (error) {
    console.error("❌ Error fetching hunger status:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Export the router
module.exports = router;
