const validateRole = require('./validateRole');

const { rolesPermissions } = leemons.plugin.config.constants;

module.exports = function getRolePermissions(role = 'noPermission') {
  if (validateRole(role)) {
    return rolesPermissions[role];
  }

  throw new Error(`The role "${role}" is not valid.`);
};
