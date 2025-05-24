// routes/goals.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Get all goals for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ goals: user.goals });
  } catch (error) {
    console.error("❌ Error fetching goals:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Add a new goal
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, plan } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Initialize history as an empty array
    const newGoal = {
      title,
      description,
      plan,
      history: [], // <-- Make sure history is always initialized
      user: req.user.id,
    };

    user.goals.push(newGoal);
    await user.save();
    res.json(newGoal); // ✅ Send back the new goal with history initialized
  } catch (error) {
    console.error("❌ Error saving goal:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Toggle goal history
router.put("/:id/toggle", authMiddleware, async (req, res) => {
  //console.log("🔄 Toggling goal status...");

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      //console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    //console.log("✅ User found:", user.username);

    const goal = user.goals.id(req.params.id);
    //console.log(`🔍 Looking for goal with ID: ${req.params.id}`);
    //console.log("Goal found:", goal);

    if (!goal) {
      //console.log(`⚠️ Goal with ID ${req.params.id} not found for user.`);
      return res.status(404).json({ message: "Goal not found" });
    }

    const date = req.body.date;
    //console.log("📅 Date to toggle:", date);

    if (goal.history.includes(date)) {
      goal.history = goal.history.filter((d) => d !== date);
    } else {
      goal.history.push(date);
    }

    await user.save();
    //console.log("✅ Goal toggled successfully!");
    res.json(goal);
  } catch (error) {
    //console.error("❌ Error toggling goal status:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Update an existing goal
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, description, plan } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const goal = user.goals.id(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.title = title;
    goal.description = description;
    goal.plan = plan;

    await user.save();
    res.json(goal); // return the updated goal
  } catch (error) {
    console.error("❌ Error updating goal:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Remove a goal
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.goals = user.goals.filter(
      (goal) => goal._id.toString() !== req.params.id
    );
    await user.save();
    res.json(user.goals);
  } catch (error) {
    //console.error("❌ Error removing goal:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
