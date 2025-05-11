const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "goals.json");

async function getGoals() {
  console.log("getGoals function called");
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    console.log("File data read successfully:", fileData);
    if (!fileData) {
      return []; // Return an empty array if the file is empty
    }
    const savedGoals = JSON.parse(fileData);
    console.log("Parsed goals:", savedGoals);
    return savedGoals;
  } catch (error) {
    console.error("Error in getGoals:", error);
    if (error.code === "ENOENT") {
      // If the file does not exist, return an empty array
      return [];
    }
    throw error; // Re-throw other errors
  }
}

async function storeGoals(goals) {
  if (!Array.isArray(goals)) {
    throw new Error("Goals must be an array");
  }
  await fs.writeFile(filePath, JSON.stringify(goals, null, 2)); // Pretty-print JSON
}

module.exports = {
  getGoals,
  savedGoals,
};
