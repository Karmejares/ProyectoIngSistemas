const db = require("../data/db");

// Crear una meta asociada a un checklist
const createGoal = async (req, res) => {
  try {
    const { descripcion, completada, checklist_id, frecuencia_tipo, dias_custom } = req.body;

    if (!descripcion || !checklist_id) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const diasCustom = (frecuencia_tipo === 'custom' && dias_custom && dias_custom.length > 0) 
      ? JSON.stringify(dias_custom)
      : null;

    const query = `
      INSERT INTO meta (descripcion, completada, checklist_id, frecuencia_tipo, dias_custom)
      VALUES (?, ?, ?, ?, ?)
    `;

    // Insertar en la base de datos
    const [result] = await db.query(query, [
      descripcion,
      completada || false,
      checklist_id,
      frecuencia_tipo || '',
      diasCustom,
    ]);

    res.status(201).json({ message: 'Goal creada exitosamente', goalId: result.insertId });
  } catch (error) {
    console.error('Error creando goal:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


// Obtener metas por checklist_id
const getGoalsByChecklist = async (req, res) => {
  const { checklist_id } = req.params;
  try {
    const [goals] = await db.execute(
      "SELECT * FROM meta WHERE checklist_id = ?",
      [checklist_id]
    );
    res.json(goals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener las metas" });
  }
};

// (Opcional) Obtener metas por usuario_id usando JOIN
const getGoalsByUsuario = async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const [goals] = await db.execute(
      `
      SELECT m.*
      FROM meta m
      JOIN checklist c ON m.checklist_id = c.id
      WHERE c.usuario_id = ?
      `,
      [usuario_id]
    );
    res.json(goals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener las metas del usuario" });
  }
};

module.exports = {
  createGoal,
  getGoalsByChecklist,
  getGoalsByUsuario, 
};
