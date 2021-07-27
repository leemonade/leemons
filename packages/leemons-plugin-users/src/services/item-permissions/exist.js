const { table } = require('../tables');
const { validateItemPermission } = require('../../validations/item-permissions');

/**
 * ES:
 * Comprueba para los parametros especificados si exista ya o no algún registro
 *
 * EN:
 * Checks for the specified parameters whether or not a record already exists.
 *
 * @public
 * @static
 * @param {ItemPermission} data - Array of permissions
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function exist(
  { permissionName, actionNames, target, type, item, center },
  { transacting } = {}
) {
  await validateItemPermission({ permissionName, actionNames, target, type, item, center });
  const query = {
    permissionName,
    actionName_$in: actionNames,
    type,
    item,
  };
  if (target) query.target = target;
  if (center) query.center = center;
  const response = await table.itemPermissions.count(query, { transacting });
  return !!response;
}

module.exports = exist;
