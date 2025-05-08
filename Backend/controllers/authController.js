const db = require('../data/db'); 

module.exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM usuario WHERE nombre = ? AND contrasena = ?';

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error en la consulta', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (results.length > 0) {
      res.status(200).json({ message: 'Login exitoso' });
    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  });
};

module.exports.registerUser = (req, res) => {
    const { nombre, correo, contrasena, fecha_nacimiento } = req.body;
  
    db.beginTransaction((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al iniciar transacción' });
      }
  
      // Insertar en tabla usuarios
      const insertUserQuery = 'INSERT INTO usuario (nombre, email, contrasena) VALUES (?, ?, ?)';
      db.query(insertUserQuery, [nombre, correo, contrasena], (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error insertando en usuarios:', err);
            res.status(500).json({ message: 'Error al registrar usuario' });
          });
        }
  
        const userId = result.insertId;
  
        // Insertar en tabla datospersonales usando el id del usuario
        const insertDataQuery = 'INSERT INTO datospersonales (id, fecha_nacimiento) VALUES (?, ?)';
        db.query(insertDataQuery, [userId, fecha_nacimiento], (err, result2) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error insertando en datospersonales:', err);
              res.status(500).json({ message: 'Error al guardar datos personales' });
            });
          }
  
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error haciendo commit:', err);
                res.status(500).json({ message: 'Error al finalizar registro' });
              });
            }
  
            res.status(201).json({ message: 'Usuario registrado correctamente' });
          });
        });
      });
    });
  };