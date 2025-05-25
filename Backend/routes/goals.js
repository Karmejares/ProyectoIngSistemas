// routes/goals.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

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

    // ⚠️ Aseguramos que cada paso tenga un _id si usas StepSchema con _id (opcional)
    const formattedPlan = plan.map((step) => ({
      ...step,
      _id: new mongoose.Types.ObjectId(),
    }));

    const newGoal = {
      _id: new mongoose.Types.ObjectId(), // ✅ Generamos ID explícitamente
      title,
      description,
      plan: formattedPlan,
      history: [],
      createdAt: new Date(),
    };

    user.goals.push(newGoal);
    await user.save();

    // Buscamos el último goal guardado para retornarlo ya con el ID asignado
    const savedGoal = user.goals[user.goals.length - 1];

    res.json(savedGoal);
  } catch (error) {
    console.error("❌ Error saving goal:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Add the date to a step of a goal
router.put(
  "/:goalId/steps/:stepId/toggle",
  authMiddleware,
  async (req, res) => {
    const { goalId, stepId } = req.params;

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const goal = user.goals.id(goalId);
      if (!goal) return res.status(404).json({ message: "Goal not found" });

      const step = goal.plan.id(stepId);
      if (!step) return res.status(404).json({ message: "Step not found" });

      // Toggle: si ya tiene fecha, la borra; si no tiene, le asigna una
      if (step.date) {
        step.date = null;
      } else {
        step.date = new Date();
      }

      await user.save();
      res.json({ message: "Step status toggled", step });
    } catch (error) {
      console.error("❌ Error toggling step:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

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
    goal.plan = (plan || []).map((step) => ({
      stepDescription: step.stepDescription || step, // si viene objeto, toma la propiedad; si string, la usa directamente
      date: step.date || null,
    }));

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
