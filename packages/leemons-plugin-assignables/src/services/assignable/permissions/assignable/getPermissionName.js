module.exports = function getPermissionName(assignable) {
  return leemons.plugin.prefixPN(`assignable.${assignable.id}`);
};
