const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");


const optionsRoutes = require("./routes/options");
const usuariosRoutes = require("./routes/usuarios");
const goalsRoutes = require("./routes/goals");
const storeRoutes = require("./routes/store");
const authRoutes = require("./routes/auth");




const app = express();

app.use(bodyParser.json());
app.use(cors());

// Rutas

app.use('/api/options', optionsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/store', storeRoutes);



app.listen(8000, () => {
  console.log("Servidor backend corriendo en http://localhost:8000");
});