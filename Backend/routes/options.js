
const express = require('express');
const { getOptions, storeOptions } = require('../data/options');


const router = express.Router();

router.get('/', async (req, res) => {
  const options = await getOptions();
  res.json({ options });
});

router.post('/', async (req, res) => {
  const existingOptions = await getOptions();
  const optionsData = req.body;
  const newOptions = {
    ...optionsData,
    id: Math.random().toString(),
  };
  const updatedOptions = [newOptions, ...existingOptions];
  await storeOptions(updatedOptions);
});

module.exports = router;
