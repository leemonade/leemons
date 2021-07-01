const _ = require('lodash');
const { manyPermissionsHasManyActions } = require('../permissions/manyPermissionsHasManyActions');
const { addPermissionMany } = require('./addPermissionMany');
const { table } = require('../tables');

/**
 * Create one role
 * @private
 * @static
 * @param {RoleAdd} data
 * @param {any=} _transacting -  DB Transaction
 * @return {Promise<Role>} Created / Updated role
 * */
async function add({ name, permissions }, { transacting: _transacting }) {
  return global.utils.withTransaction(
    async (transacting) => {
      const existRole = await table.roles.count({ name }, { transacting });
      if (existRole) throw new Error(`Role with name '${name}' already exists`);
      const dataToCheckPermissions = _.map(permissions, (permission) => [
        permission.permissionName,
        permission.actionNames,
      ]);
      if (!(await manyPermissionsHasManyActions(dataToCheckPermissions, { transacting })))
        throw new Error(`One or more permissions or his actions not exist`);

      leemons.log.info(`Creating role '${name}'`);
      const role = await table.roles.create({ name }, { transacting });
      await addPermissionMany(role.id, permissions, { transacting });
      return role;
    },
    table.roles,
    _transacting
  );
}

module.exports = { add };
