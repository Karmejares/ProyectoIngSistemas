// routes/pet.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Update Last Fed Time and Respond with Hunger Level
router.put("/feed", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Update last fed time
    user.lastFed = new Date();
    await user.save();

    // ✅ Calculate the new hunger level (should reset to 0)
    const hungerLevel = 0;

    res.status(200).json({ lastFed: user.lastFed, hungerLevel });
  } catch (error) {
    console.error("❌ Error updating last fed time:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

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

    // Assuming every 3 hours increases hunger by 12.5%
    const hungerLevel = Math.min(hoursPassed * 12.5, 100);

    res.status(200).json({ hungerLevel, lastFed });
  } catch (error) {
    console.error("❌ Error fetching hunger status:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Export the router
module.exports = router;
