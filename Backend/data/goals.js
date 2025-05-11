const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, 'goals.json');

async function getGoals() {
  const fileData = await fs.readFile(filePath);
  const savedGoals = JSON.parse(fileData);
  return savedGoals;
}

async function saveGoals(goals) {
  await fs.writeFile(filePath, JSON.stringify(goals));
}

module.exports = {
  getGoals,
  saveGoals,
};
