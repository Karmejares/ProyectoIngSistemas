const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, 'goals.json');

async function getGoals() {
  const fileData = await fs.readFile(filePath);
  const storedGoals = JSON.parse(fileData);
  return storedGoals;
}

async function storeGoals(goals) {
  await fs.writeFile(filePath, JSON.stringify(goals));
}

module.exports = {
  getGoals,
  storeGoals,
};
