const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, 'store.json');

async function getStore() {
  const fileData = await fs.readFile(filePath);
  const stored = JSON.parse(fileData);
  return stored;
}

async function store(store) {
  await fs.writeFile(filePath, JSON.stringify(store));
}

module.exports = {
  getStore,
  store,
};
