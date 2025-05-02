const express = require('express');
const { getStore, store } = require('../data/store');

const router = express.Router();

router.get('/', async (req, res) => {
  const store = await getStore();
  res.json({ store });
});

router.post('/', async (req, res) => {
  const existingStore = await getStore();
  const storeData = req.body;
  const newStore = {
    ...storeData,
    id: Math.random().toString(),
  };
  const updatedStore = [newStore, ...existingStore];
  await store(updatedStore);
  res.status(201).json({ message: 'Producto creado.', store: newStore });
});

module.exports = router;
