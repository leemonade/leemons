const { roles } = leemons.plugin.config.constants;

module.exports = function validateRole(role) {
  return roles.includes(role);
};
