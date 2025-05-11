const express = require("express");
const { getGoals, storeGoals } = require("../data/goals");

const router = express.Router();

// GET /api/goals
router.get("/", async (req, res) => {
  console.log("GET /api/goals route hit"); // Debug log
  try {
    const goals = await getGoals(); // Fetch goals from the data file
    console.log("Goals fetched successfully:", goals); // Log the fetched goals
    res.json({ goals }); // Send the goals as a JSON response
  } catch (error) {
    console.error("Error fetching goals:", error); // Log any errors
    res.status(500).json({ message: "Failed to fetch goals" }); // Send an error response
  }
});

// POST /api/goals
router.post("/", async (req, res) => {
  try {
    const { name, history = [] } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Goal name is required" });
    }

    const existingGoals = await getGoals();
    const newGoal = {
      id: Math.random().toString(),
      name,
      history,
    };

    const updatedGoals = [newGoal, ...existingGoals];
    await storeGoals(updatedGoals);

    res
      .status(201)
      .json({ message: "Goal created successfully.", goal: newGoal });
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ message: "Failed to create goal" });
  }
});

// PUT /api/goals/:id/complete
router.put("/:id/complete", async (req, res) => {
  const goalId = req.params.id;
  const { completionDate } = req.body;

  if (!completionDate) {
    return res.status(400).json({ message: "completionDate is required" });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(completionDate)) {
    return res
      .status(400)
      .json({ message: "Invalid date format. Use YYYY-MM-DD." });
  }

  try {
    const existingGoals = await getGoals();
    const goalIndex = existingGoals.findIndex((goal) => goal.id === goalId);

    if (goalIndex === -1) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const updatedGoals = [...existingGoals];
    const goalToUpdate = updatedGoals[goalIndex];
    goalToUpdate.history = goalToUpdate.history
      ? [...goalToUpdate.history, completionDate]
      : [completionDate];

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

// PUT /api/goals/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedGoal = req.body;

  try {
    const goals = await getGoals();
    const goalIndex = goals.findIndex((goal) => goal.id === parseInt(id));

    if (goalIndex === -1) {
      return res.status(404).json({ message: "Goal not found" });
    }

    goals[goalIndex] = updatedGoal; // Update the goal
    await saveGoals(goals); // Save the updated goals to the file

    res.json({ message: "Goal updated successfully", goal: updatedGoal });
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ message: "Failed to update goal" });
  }
});

module.exports = router;
