const express = require("express");
const bodyParser = require("body-parser");
<<<<<<< Updated upstream
=======
const cors = require("cors");
const dotenv = require('dotenv');


dotenv.config();
>>>>>>> Stashed changes

const cors = require("cors");

const optionsRoutes = require("./routes/options");
const usuariosRoutes = require("./routes/usuarios");
const goalsRoutes = require("./routes/goals");
const storeRoutes = require("./routes/store");
const authRoutes = require("./routes/auth");




const app = express();

app.use(cors());
app.use(bodyParser.json());


// Rutas

app.use('/api/options', optionsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/store', storeRoutes);


<<<<<<< Updated upstream
app.listen(3001, () => {
=======

app.listen(8000, () => {
>>>>>>> Stashed changes
  console.log("Servidor backend corriendo en http://localhost:3001");
});