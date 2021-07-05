const _ = require('lodash');
const { validateTypePrefix } = require('../../validations/exists');
const { hasActionMany } = require('../permissions/hasActionMany');
const { table } = require('../tables');
const { validateExistItemPermissions } = require('../../validations/exists');
const { validateItemPermission } = require('../../validations/item-permissions');
const { exist } = require('../permissions/exist');

/**
 * ES:
 * Si no existe ya añade un nuevo item
 *
 * EN:
 * If it does not already exist, add a new item
 *
 * @public
 * @static
 * @param {ItemPermission} data - Item permission
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function add({ permissionName, actionNames, target, type, item }, { transacting } = {}) {
  validateItemPermission({ permissionName, actionNames, target, type, item });
  validateTypePrefix(type, this.calledFrom);

  console.log(permissionName);

  if (!(await exist(permissionName, { transacting })))
    throw new Error('The specified permit does not exist');

  if (!(await hasActionMany(permissionName, actionNames, { transacting })))
    throw new Error('Some of the actions do not exist for the specified permit');

  await validateExistItemPermissions(
    {
      permissionName,
      actionNames,
      target,
      type,
      item,
    },
    { transacting }
  );
  const toSave = _.map(actionNames, (actionName) => {
    return {
      permissionName,
      actionName,
      target,
      type,
      item,
    };
  });

  return table.itemPermissions.createMany(toSave);
}

module.exports = add;
