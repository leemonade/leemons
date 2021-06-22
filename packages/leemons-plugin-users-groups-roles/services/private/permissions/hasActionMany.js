const { table } = require('../tables');

/**
 * Check if the permission has actions
 * @public
 * @static
 * @param {string} permissionName - Permission name
 * @param {string[]} actionNames - Action names
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function hasActionMany(permissionName, actionNames, transacting) {
  const count = await table.permissionAction.count(
    {
      permissionName,
      actionName_$in: actionNames,
    },
    { transacting }
  );
  return count === actionNames.length;
}

module.exports = { hasActionMany };
