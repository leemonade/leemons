module.exports = function getPermissionName(assignableInstance, assignable) {
  if (assignable) {
    return leemons.plugin.prefixPN(
      `assignable.${assignable}.assignableInstance.${assignableInstance}`
    );
  }

  return leemons.plugin.prefixPN(`assignableInstance.${assignableInstance}`);
};
