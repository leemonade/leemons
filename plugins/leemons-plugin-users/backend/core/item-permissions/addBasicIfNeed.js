const { validateTypePrefix } = require('../../validations/exists');
const { basicPermission } = require('../../config/constants');
const { add } = require('./add');
const { exist } = require('./exist');

/**
 * ES:
 * Si no existen permisos, le añade los básicos
 *
 * EN:
 * If it does not already exist permissions, add a basics ones
 *
 * @public
 * @static
 * @param {string} item
 * @param {string} type
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function addBasicIfNeed({ item, type, ctx }) {
  validateTypePrefix(type, ctx.callerPlugin);

  const hasPermissions = await exist({ query: { item }, ctx });

  if (!hasPermissions) {
    return add({
      item,
      type,
      data: {
        permissionName: basicPermission.permissionName,
        actionNames: [basicPermission.actionName],
      },
      isCustomPermission: true,
      ctx,
    });
  }

  return null;
}

module.exports = { addBasicIfNeed };
