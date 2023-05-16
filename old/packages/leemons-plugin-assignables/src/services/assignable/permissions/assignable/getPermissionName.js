module.exports = function getPermissionName(assignableId, { prefix = false } = {}) {
  const name = `assignable.${assignableId}`;

  return prefix ? leemons.plugin.prefixPN(name) : name;
};
