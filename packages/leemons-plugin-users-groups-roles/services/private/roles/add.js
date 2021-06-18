const _ = require('lodash');
const { addPermissionMany } = require('./addPermissionMany');
const { table } = require('../tables');

/**
 * Create one role
 * @private
 * @static
 * @param {RoleAdd} data
 * @return {Promise<Role>} Created / Updated role
 * */
async function add({ name, permissions }) {
  // TODO IMPORTAR PERMISSION
  const existRole = await table.roles.count({ name });
  if (existRole) throw new Error(`Role with name '${name}' already exists`);
  const dataToCheckPermissions = _.map(permissions, (permission) => [
    permission.permissionName,
    permission.actionNames,
  ]);
  if (!(await permissionsService.manyPermissionsHasManyActions(dataToCheckPermissions)))
    throw new Error(`One or more permissions or his actions not exist`);

  return table.roles.transaction(async (transacting) => {
    leemons.log.info(`Creating role '${name}'`);
    const role = await table.roles.create({ name }, { transacting });
    await addPermissionMany(role.id, permissions, transacting);
    return role;
  });
}

module.exports = { add };
