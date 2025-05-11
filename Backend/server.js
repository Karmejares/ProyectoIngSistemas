const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { getGoals } = require("./data/goals");

const optionsRoutes = require("./routes/options");
const usuariosRoutes = require("./routes/usuarios");
const goalsRoutes = require("./routes/goals");
const storeRoutes = require("./routes/store");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware
});
// Rutas
app.use("/api/options", optionsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/goals", goalsRoutes); // Delegate /api/goals to goalsRoutes
app.use("/api/store", storeRoutes);

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Start the server
app.listen(3001, () => {
  console.log("Servidor backend corriendo en http://localhost:3001");
});
