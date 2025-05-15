const express = require("express");
const router = express.Router();
const User = require("../models/User"); // ✅ Import the User model

// ✅ Get user's time limit
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    console.log("🔎 Fetching time limit for user:", username);

    const user = await User.findOne({ username });
    if (user) {
      res.status(200).json({
        username: user.username,
        timeLimit: user.timeLimit,
      });
    } else {
      console.warn("⚠️ User not found:", username);
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("❌ Error fetching user time limit:", error.message);
    res.status(500).json({ error: "Server error while fetching time limit." });
  }
});

// ✅ Update user's time limit
router.put("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { timeLimit } = req.body;

    console.log("📝 Updating time limit for:", username, "to", timeLimit);

    // 🔄 Update the user with the new time limit
    const user = await User.findOneAndUpdate(
      { username },
      { timeLimit },
      { new: true, upsert: false } // Do not create a new document if not found
    );

    if (user) {
      console.log("✅ Time limit updated successfully for:", username);
      res.status(200).json({
        username: user.username,
        timeLimit: user.timeLimit,
      });
    } else {
      console.warn("⚠️ User not found for update:", username);
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("❌ Error updating time limit:", error.message);
    res.status(500).json({ error: "Server error while updating time limit." });
  }
});

// ✅ Delete Account Route
router.delete("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    console.log("🗑️ Deleting account for user:", username);

    const user = await User.findOneAndDelete({ username });
    if (user) {
      console.log("✅ Account deleted for:", username);
      res.status(200).json({ message: "User account deleted successfully" });
    } else {
      console.warn("⚠️ User not found for deletion:", username);
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("❌ Error deleting account:", error.message);
    res.status(500).json({ error: "Server error while deleting account." });
  }
});

module.exports = router;
