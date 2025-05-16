// model/User.js

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    timeLimit: { type: String, default: "00:00" }, // Added this for time limit
    isLoggedIn: { type: Boolean, default: false },
    coins: {
      type: Number,
      default: 50, // ✅ This should be 50 if not provided during creation
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
