const _ = require('lodash');
const { validateTypePrefix } = require('../../validations/exists');
const { manyPermissionsHasManyActions } = require('../permissions/manyPermissionsHasManyActions');
const { validateExistItemPermissions } = require('../../validations/exists');
const { validateItemPermission } = require('../../validations/item-permissions');
const { existMany } = require('../permissions/existMany');
const { removeAllItemsCache } = require('./removeAllItemsCache');

/**
 * ES:
 * Si no existe ya añade un nuevo item
 *
 * EN:
 * If it does not already exist, add a new item
 *
 * @public
 * @static
 * @param {string} item
 * @param {string} type
 * @param {AddItemPermission | AddItemPermission[]} data - Item permission
 * @param {boolean=} isCustomPermission - If it is a custom permit, it is not checked if it exists in the list of permits.
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 *
 * @example
 *
 * leemons.getPlugin('users').services.permissions.addItem(
 * 'id del item por ejemplo el id de un calendario',
 * 'plugins.calendar.calendar',
 * {
 *    permissionName: 'plugins.calendar.calendar.idcalendario',
 *    actionNames: ['view', 'delete', 'admin', 'owner'],
 * },
 * {
 *   isCustomPermission: true
 * });
 *
 * */
async function add({ item, type, data, isCustomPermission, ctx }) {
  const _data = _.isArray(data) ? data : [data];
  _.forEach(_data, (d) => {
    validateItemPermission({ ...d, type, item });
  });

  validateTypePrefix(type, ctx.callerPlugin);

  if (!isCustomPermission) {
    if (!(await existMany({ permissionNames: _.map(_data, 'permissionName'), ctx }))) {
      throw new Error('The specified permit does not exist');
    }
    if (
      !(await manyPermissionsHasManyActions({
        data: _.map(_data, ({ permissionName, actionNames }) => [permissionName, actionNames]),
        ctx,
      }))
    ) {
      throw new Error('Some of the actions do not exist for the specified permit');
    }
  }

  await Promise.all(
    _.map(_data, ({ actionNames, ...d }) =>
      validateExistItemPermissions({
        query: {
          ...d,
          actionName_$in: actionNames,
          item,
        },
        ctx,
      })
    )
  );

  const toSave = [];
  _.forEach(_data, ({ actionNames, ...d }) => {
    _.forEach(actionNames, (actionName) => {
      toSave.push({
        ...d,
        actionName,
        type,
        item,
      });
    });
  });
  const response = await ctx.tx.db.ItemPermissions.createMany(toSave);
  await removeAllItemsCache({ ctx });
  return response;
}

module.exports = { add };
