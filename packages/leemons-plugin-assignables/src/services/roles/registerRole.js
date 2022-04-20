const { roles } = require('../tables');
const getRole = require('./getRole');

module.exports = async function registerRole(role, { transacting }) {
  if (!this.calledFrom) {
    throw new Error("Can't register role without plugin name");
  }

  // EN: Check if role already exists
  // ES: Comprueba si el rol ya existe
  try {
    const existingRole = await getRole.call(this, role, { transacting });

    if (existingRole) {
      throw new Error('Role already exists');
    }
  } catch (e) {
    if (e.message !== 'Role not found') {
      throw e;
    }
  }

  // EN: Register role
  // ES: Registrar rol
  await roles.create({ name: role, plugin: this.calledFrom }, { transacting });

  // TODO: Register leebrary category

  return true;
};
