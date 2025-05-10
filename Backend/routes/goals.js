const express = require('express');
const { getGoals, storeGoals } = require('../data/goals');

const router = express.Router();

router.get('/', async (req, res) => {
  const goals = await getGoals();
  res.json({ goals });
});

router.post('/', async (req, res) => {
  const existingGoals = await getGoals();
  const goalsData = req.body;
  const newGoals = {
    ...goalsData,
    id: Math.random().toString(),
  };
  const updatedGoals = [newGoals, ...existingGoals];
  await storeGoals(updatedGoals);
  res.status(201).json({ message: 'Goals creado.', goals: newGoals });
});

router.put('/:id/complete', async (req, res) => {
  const goalId = req.params.id;
  const { completionDate } = req.body;

  if (!completionDate) {
    return res.status(400).json({ message: 'completionDate is required' });
  }

  const existingGoals = await getGoals();
  const goalIndex = existingGoals.findIndex(goal => goal.id === goalId);

  if (goalIndex === -1) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  const updatedGoals = [...existingGoals];
  const goalToUpdate = updatedGoals[goalIndex];
  goalToUpdate.history = goalToUpdate.history ? [...goalToUpdate.history, completionDate] : [completionDate];

  await storeGoals(updatedGoals);
  res.json({ message: 'Goal completion updated successfully', goal: goalToUpdate });
});

module.exports = router;
