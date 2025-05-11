const path = require("path");
console.log(
  "Resolved path to goals.js:",
  path.resolve(__dirname, "./data/goals")
);

const { getGoals } = require("./data/goals");

(async () => {
  try {
    const goals = await getGoals();
    console.log("Goals fetched successfully:", goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
  }
})();
