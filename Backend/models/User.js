const mongoose = require("mongoose");

const StepSchema = new mongoose.Schema({
  stepDescription: { type: String, required: true },
  date: { type: Date, default: null }, // Se marcará cuando se cumpla el paso
});

const GoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  plan: { type: [StepSchema], default: [] }, // Cambiado aquí
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
    goals: [GoalSchema], // Usamos GoalSchema como subdocumento
    lastFed: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
