const mongoose = require("mongoose");

const StepSchema = new mongoose.Schema({
  stepDescription: { type: String, required: true },
  date: { type: Date, default: null },
});

const GoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  plan: { type: [StepSchema], default: [] },
  history: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    timeLimit: { type: String, default: "00:00" },
    isLoggedIn: { type: Boolean, default: false },
    coins: {
      type: Number,
      default: 50,
    },
    foodInventory: {
      type: [String],
      default: [],
    },
    goals: [GoalSchema],
    lastFed: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
