module.exports = function getPermissionType(assignable) {
  return leemons.plugin.prefixPN(`assignable.${assignable.role}`);
};
