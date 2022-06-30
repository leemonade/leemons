module.exports = function getPermissionType(assignableRole) {
  return leemons.plugin.prefixPN(`assignable.${assignableRole}`);
};
