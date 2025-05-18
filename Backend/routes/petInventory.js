const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Get the food inventory
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.foodInventory);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Add food to the inventory
router.post("/add", authMiddleware, async (req, res) => {
  console.log("➡️ Route /add hit");
  const { foodItem } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.foodInventory) {
      user.foodInventory = [];
    }

    user.foodInventory.push(foodItem);
    await user.save();
    res.json(user.foodInventory);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Remove food from the inventory
router.post("/remove", authMiddleware, async (req, res) => {
  const { foodItem } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.foodInventory = user.foodInventory.filter((item) => item !== foodItem);
    await user.save();
    res.json(user.foodInventory);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
