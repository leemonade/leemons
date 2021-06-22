const _ = require('lodash');
const { manyPermissionsHasManyActions } = require('../permissions/manyPermissionsHasManyActions');
const { addPermissionMany } = require('./addPermissionMany');
const { removePermissionAll } = require('./removePermissionAll');
const { table } = require('../tables');

/**
 * Update one role
 * @private
 * @static
 * @param {RoleUpdate} data
 * @param {any=} _transacting - DB Transaction
 * @return {Promise<Role>} Created / Updated role
 * */
async function update({ id, name, permissions }, _transacting) {
  return global.utils.withTransaction(
    async (transacting) => {
      let existRole = await table.roles.count({ id }, { transacting });
      if (!existRole) throw new Error(`The role with the specified id does not exist`);

      existRole = await table.roles.count({ id_$ne: id, name }, { transacting });
      if (existRole) throw new Error(`Role with name '${name}' already exists`);

      const dataToCheckPermissions = _.map(permissions, (permission) => [
        permission.permissionName,
        permission.actionNames,
      ]);
      if (!(await manyPermissionsHasManyActions(dataToCheckPermissions, transacting)))
        throw new Error(`One or more permissions or his actions not exist`);

      leemons.log.info(`Updating role '${name}'`);
      const values = await Promise.all([
        removePermissionAll(id, transacting),
        table.roles.update({ id }, { name }, { transacting }),
      ]);

      await addPermissionMany(id, permissions, transacting);
      return values[1];
    },
    table.roles,
    _transacting
  );
}

module.exports = { update };
