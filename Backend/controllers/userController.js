const db = require('../data/db'); 

exports.updateTimeLimit = (req, res) => {
  const { userId, timeLimit } = req.body;

  const query = 'UPDATE usuario SET time_limit = ? WHERE id = ?';
  db.query(query, [timeLimit, userId], (err, result) => {
    if (err) {
      console.error('Error actualizando time limit:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Time limit actualizado correctamente' });
  });
};

/*exports.updatePrivacy = (req, res) => {
  const { userId, privacy } = req.body;

  const query = 'UPDATE usuarios SET privacy = ? WHERE id = ?';
  db.query(query, [privacy, userId], (err, result) => {
    if (err) {
      console.error('Error actualizando privacidad:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Privacidad actualizada correctamente' });
  });
};*/

exports.changePassword = (req, res) => {
  const { userId, newPassword } = req.body;

  console.log("Recibido en backend:", userId, newPassword);

  if (!userId || !newPassword) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  const query = 'UPDATE usuario SET contrasena = ? WHERE id = ?';
  db.query(query, [newPassword, userId], (err, result) => {
    if (err) {
      console.error('Error actualizando contraseña:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Contraseña actualizada correctamente' });
  });
};

exports.deleteAccount = (req, res) => {
  const { userId } = req.body;

  const query = 'DELETE FROM usuario WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error eliminando usuario:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Cuenta eliminada correctamente' });
  });
};
