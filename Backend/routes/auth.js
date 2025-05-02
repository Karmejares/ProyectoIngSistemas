const express = require('express');
const fs = require("fs/promises");
const path = require("path");

const router = express.Router();

const usersFilePath = path.join(__dirname, '../data/usuarios.json');

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const fileData = await fs.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(fileData);

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
