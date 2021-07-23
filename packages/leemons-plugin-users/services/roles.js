const roles = require('../src/services/roles');

module.exports = {
  // TODO Esto no se deberia de tener acceso, lo pongo para que el template pueda crear centros
  add: roles.add,
};
