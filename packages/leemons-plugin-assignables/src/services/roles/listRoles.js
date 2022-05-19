const { roles } = require('../tables');

module.exports = async function listRoles({ transacting }) {
  const rolesList = await roles.find({}, { transacting });

  return rolesList.map((role) => role.name);
};
