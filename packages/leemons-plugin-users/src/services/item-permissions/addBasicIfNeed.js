const _ = require('lodash');
const { validateTypePrefix } = require('../../validations/exists');
const { basicPermission } = require('../../../config/constants');
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
async function addBasicIfNeed(item, type, { transacting } = {}) {
  validateTypePrefix(type, this.calledFrom);

  const hasPermissions = await exist({ item }, { transacting });

  if (!hasPermissions) {
    return add.call(
      this,
      item,
      type,
      {
        permissionName: basicPermission.permissionName,
        actionNames: [basicPermission.actionName],
      },
      { isCustomPermission: true, transacting }
    );
  }

  return null;
}

module.exports = { addBasicIfNeed };
