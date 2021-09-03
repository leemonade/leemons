const _ = require('lodash');
const { validateTypePrefix } = require('../../validations/exists');
const { manyPermissionsHasManyActions } = require('../permissions/manyPermissionsHasManyActions');
const { table } = require('../tables');
const { validateExistItemPermissions } = require('../../validations/exists');
const { validateItemPermission } = require('../../validations/item-permissions');
const { existMany } = require('../permissions/existMany');

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
 * */
async function add(item, type, data, { isCustomPermission, transacting } = {}) {
  const _data = _.isArray(data) ? data : [data];
  _.forEach(_data, (d) => {
    validateItemPermission({ ...d, type, item });
  });

  validateTypePrefix(type, this.calledFrom);

  if (!isCustomPermission) {
    if (!(await existMany(_.map(_data, 'permissionName'), { transacting }))) {
      console.error('The specified permit does not exist', _data);
      throw new Error('The specified permit does not exist');
    }
    if (
      !(await manyPermissionsHasManyActions(
        _.map(_data, ({ permissionName, actionNames }) => [permissionName, actionNames]),
        { transacting }
      ))
    ) {
      console.log(_data);
      throw new Error('Some of the actions do not exist for the specified permit');
    }
  }

  await Promise.all(
    _.map(_data, ({ actionNames, ...d }) =>
      validateExistItemPermissions(
        {
          ...d,
          actionName_$in: actionNames,
          item,
        },
        { transacting }
      )
    )
  );

  const toSave = [];
  _.forEach(_data, (d) => {
    _.forEach(d.actionNames, (actionName) => {
      toSave.push({
        ...d,
        actionName,
        type,
        item,
      });
    });
  });

  return table.itemPermissions.createMany(toSave);
}

module.exports = { add };
