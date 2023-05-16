const { roles } = require('../tables');

module.exports = async function getRole(role, { transacting } = {}) {
  if (!this.calledFrom) {
    throw new Error("Can't get role without plugin name");
  }

  // EN: Get role
  // ES: Obtener rol
  const foundRoles = await roles.find({ name: role }, { transacting });

  if (foundRoles.length) {
    /* Jaime: 04/06/22 Necesito poder consultar desde cualquier plugin
    if (!(this.calledFrom === 'plugins.assignables' || foundRoles[0].plugin === this.calledFrom)) {
      throw new Error("Role doesn't belong to this plugin");
    }
     */

    return foundRoles[0];
  }
  throw new Error('Role not found');
};
