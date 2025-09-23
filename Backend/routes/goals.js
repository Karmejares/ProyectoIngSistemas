// routes/goals.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

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

router.post("/", authMiddleware, async (req, res) => {
  const { title, description, plan } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const formattedPlan = plan.map((step) => ({
      ...step,
      _id: new mongoose.Types.ObjectId(),
    }));

    const newGoal = {
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      plan: formattedPlan,
      history: [],
      createdAt: new Date(),
    };

    user.goals.push(newGoal);
    await user.save();

    const savedGoal = user.goals[user.goals.length - 1];

    res.json(savedGoal);
  } catch (error) {
    console.error("❌ Error saving goal:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.patch("/:goalId/plan/step/:stepId", authMiddleware, async (req, res) => {
  const { goalId, stepId } = req.params;
  const { date } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const goal = user.goals.id(goalId);
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    const step = goal.plan.id(stepId);
    if (!step) return res.status(404).json({ message: "Step not found" });

    step.date = date;

    await user.save(); // Guarda cambios en el documento user
    res.json({ step });
  } catch (error) {
    console.error("❌ Error updating step date:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:id/toggle", authMiddleware, async (req, res) => {
  //console.log("🔄 Toggling goal status...");

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      //console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const goal = user.goals.id(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const date = req.body.date;

    if (goal.history.includes(date)) {
      goal.history = goal.history.filter((d) => d !== date);
    } else {
      goal.history.push(date);
    }

    await user.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

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
    goal.plan = (plan || []).map((step) => ({
      stepDescription: step.stepDescription || step,
      date: step.date || null,
    }));

    await user.save();
    res.json(goal);
  } catch (error) {
    console.error("❌ Error updating goal:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

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
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
