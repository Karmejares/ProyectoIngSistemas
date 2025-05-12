const express = require("express");
const { getGoals, storeGoals } = require("../data/goals");

const router = express.Router();

// 🚀 GET /api/goals
router.get("/", async (req, res) => {
  console.log("GET /api/goals route hit");
  try {
    const goals = await getGoals();
    console.log("Goals fetched successfully:", goals);
    res.json({ goals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ message: "Failed to fetch goals" });
  }
});

// 🚀 POST /api/goals
router.post("/", async (req, res) => {
  console.log("POST /api/goals route hit");
  console.log("Request body:", req.body);

  try {
    const { name, history = [] } = req.body;

    if (!name) {
      console.log("Goal name is missing");
      return res.status(400).json({ message: "Goal name is required" });
    }

    const existingGoals = await getGoals();
    console.log("Existing goals:", existingGoals);

    const newGoal = {
      id: Math.random().toString(),
      name,
      history,
    };

    const updatedGoals = [newGoal, ...existingGoals];
    await storeGoals(updatedGoals);

    console.log("New goal created:", newGoal);
    res
      .status(201)
      .json({ message: "Goal created successfully.", goal: newGoal });
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ message: "Failed to create goal" });
  }
});

// 🚀 PUT /api/goals/:id/complete
router.put("/:id/complete", async (req, res) => {
  console.log("PUT /api/goals/:id/complete route hit");
  console.log("Request params:", req.params);
  console.log("Request body:", req.body);

  const goalId = req.params.id;
  const { completionDate } = req.body;

  if (!completionDate) {
    console.log("Completion date is missing");
    return res.status(400).json({ message: "completionDate is required" });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(completionDate)) {
    console.log("Invalid date format:", completionDate);
    return res
      .status(400)
      .json({ message: "Invalid date format. Use YYYY-MM-DD." });
  }

  try {
    const existingGoals = await getGoals();
    console.log("Existing goals:", existingGoals);

    const goalIndex = existingGoals.findIndex((goal) => goal.id === goalId);

    if (goalIndex === -1) {
      console.log("Goal not found with ID:", goalId);
      return res.status(404).json({ message: "Goal not found" });
    }

    const updatedGoals = [...existingGoals];
    const goalToUpdate = updatedGoals[goalIndex];
    goalToUpdate.history = goalToUpdate.history
      ? [...goalToUpdate.history, completionDate]
      : [completionDate];

    console.log("Updated goal:", goalToUpdate);
    await storeGoals(updatedGoals);

    res.json({
      message: "Goal completion updated successfully",
      goal: goalToUpdate,
    });
  } catch (error) {
    console.error("Error updating goal completion:", error);
    res.status(500).json({ message: "Failed to update goal completion" });
  }
});

// 🚀 PUT /api/goals/:id
router.put("/:id", async (req, res) => {
  console.log("PUT /api/goals/:id route hit");
  console.log("Request params:", req.params);
  console.log("Request body:", req.body);

  const { id } = req.params;
  const updatedGoal = req.body;

  try {
    const goals = await getGoals();
    console.log("Existing goals:", goals);

    const goalIndex = goals.findIndex((goal) => goal.id === id);

    if (goalIndex === -1) {
      console.log("Goal not found with ID:", id);
      return res.status(404).json({ message: "Goal not found" });
    }

    goals[goalIndex] = updatedGoal;
    console.log("Updated goal:", updatedGoal);

    await storeGoals(goals);
    res.json({ message: "Goal updated successfully", goal: updatedGoal });
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ message: "Failed to update goal" });
  }
});

// 🚀 DELETE /api/goals/:id
router.delete("/:id", async (req, res) => {
  console.log("DELETE /api/goals/:id route hit");
  console.log("Request params:", req.params);

  const { id } = req.params;

  try {
    const goals = await getGoals();
    console.log("Existing goals:", goals);

    const updatedGoals = goals.filter((goal) => goal.id !== id);

    if (goals.length === updatedGoals.length) {
      console.log("Goal not found with ID:", id);
      return res.status(404).json({ message: "Goal not found" });
    }

    await storeGoals(updatedGoals);
    console.log(`Goal with ID ${id} deleted successfully.`);
    res.status(200).json({ message: "Goal deleted successfully." });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ message: "Failed to delete goal" });
  }
});

module.exports = router;
