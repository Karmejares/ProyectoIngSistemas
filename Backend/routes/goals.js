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

module.exports = router;
