const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, 'usuarios.json');

async function Usuarios() {
  const fileData = await fs.readFile(filePath);
  const Usuarios = JSON.parse(fileData);
  return Usuarios;
}

function storeUsuarios(usuarios) {
  return fs.writeFile(filePath, JSON.stringify(usuarios));
}

module.exports = {
  Usuarios,
  storeUsuarios,
};
