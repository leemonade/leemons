const { roles } = require('../tables');
const getRole = require('./getRole');

module.exports = async function registerRole(role, { transacting } = {}) {
  if (!this.calledFrom) {
    throw new Error("Can't unregister role without plugin name");
  }

  // EN: Check if role already exists (if not, throw error)
  // ES: Comprueba si el rol ya existe (si no, lanza error)
  await getRole.call(this, role, { transacting });

  // EN: Register role
  // ES: Registrar rol
  await roles.deleteMany({ name: role }, { transacting });

  // TODO: Decide what happens with the existing assignables

  // TODO: Unregister library category

  return true;
};
