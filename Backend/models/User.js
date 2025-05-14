// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  coins: {
    type: Number,
    default: 100, // Starting balance
  },
  timeLimit: {
    type: Number,
    default: 0,
  },
  privacy: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", UserSchema);
