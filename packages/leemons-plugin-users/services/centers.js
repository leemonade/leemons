const centers = require('../src/services/centers');

module.exports = {
  // TODO Esto no se deberia de tener acceso, lo pongo para que el template pueda crear centros
  add: centers.add,
  list: centers.list,
  existName: centers.existName,
};
