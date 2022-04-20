module.exports = function getPermissionName(assignableInstance) {
  return leemons.plugin.prefixPN(`assignableInstance.${assignableInstance}`);
};
