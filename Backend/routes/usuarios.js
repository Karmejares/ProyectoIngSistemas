const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔑 Authentication Routes
router.post("/register", usersController.registerUser);
router.post("/login", usersController.loginUser);

// 🔄 Protected Routes
router.put("/update-coins", authMiddleware, usersController.updateCoins);
router.put("/update-time-limit", usersController.updateTimeLimit);
router.put("/update-privacy", usersController.updatePrivacy);
router.put("/change-password", usersController.changePassword);
router.delete("/delete-account", usersController.deleteAccount);

module.exports = router;
