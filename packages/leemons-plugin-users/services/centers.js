const centers = require('../src/services/centers');

module.exports = {
  detail: centers.detail,
  // TODO Esto no se deberia de tener acceso, lo pongo para que el template pueda crear centros
  add: centers.add,
  list: centers.list,
  existName: centers.existName,
};
