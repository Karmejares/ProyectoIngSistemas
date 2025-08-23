// server.js

// ✅ Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// ✅ Import routes
const optionsRoutes = require("./routes/options");
const usuariosRoutes = require("./routes/usuarios");
const goalsRoutes = require("./routes/goals");
const storeRoutes = require("./routes/store");
const authRoutes = require("./routes/auth");
const petInventoryRoutes = require("./routes/petInventory");
const petRoutes = require("./routes/pet");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ Logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// 🔥 ✅ MongoDB Connection (No deprecated options)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 MongoDB Connected"))
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
    process.exit(1); // ✅ Exit the server if DB fails
  });

// ✅ Routes
app.use("/api/options", optionsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/pet/inventory", petInventoryRoutes);
app.use("/api/pet", petRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ error: "Server Error" });
});

// ✅ Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Server also accessible on http://192.168.1.5:${PORT}`);
});
