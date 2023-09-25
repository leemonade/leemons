/**
 * Get the permission name
 * @function getPermissionName
 * @param {Object} params - The main parameter object.
 * @param {string} params.assignableId - The id of the assignable.
 * @param {boolean} params.prefix - Flag to prefix the permission name.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {string} The permission name.
 */
function getPermissionName({ assignableId, prefix = false, ctx }) {
  const name = `assignable.${assignableId}`;

  return prefix ? ctx.prefixPN(name) : name;
}

module.exports = { getPermissionName };
