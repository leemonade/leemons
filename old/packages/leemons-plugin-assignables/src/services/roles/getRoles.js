const { uniq } = require('lodash');
const tables = require('../tables');

module.exports = async function getRole(roles, { transacting } = {}) {
  // Jaime: 04/06/22 Necesito poder consultar desde cualquier plugin
  // if (!this.calledFrom) {
  //   throw new Error("Can't get role without plugin name");
  // }

  const uniqRoles = uniq(roles);

  // EN: Get role
  // ES: Obtener rol
  const foundRoles = await tables.roles.find({ name_$in: uniqRoles }, { transacting });

  if (foundRoles.length >= uniqRoles?.length || 0) {
    return Object.fromEntries(foundRoles.map((role) => [role.name, role]));
  }

  throw new Error('Roles not found');
};
