const express = require("express");
const router = express.Router();
const {createGoal,getGoalsByChecklist,updateGoal,getGoalsByUsuario} = require("../controllers/goalController");

router.post("/", createGoal); //Crea una meta
router.get("/checklist/:checklist_id", getGoalsByChecklist); // Trae una meta por el id
router.get("/user/:usuario_id", getGoalsByUsuario);// Trae metas por usuario

module.exports = router;
