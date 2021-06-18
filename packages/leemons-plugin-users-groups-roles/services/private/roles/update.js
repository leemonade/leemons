const _ = require('lodash');
const { addPermissionMany } = require('./addPermissionMany');
const { removePermissionAll } = require('./removePermissionAll');
const { table } = require('../tables');

/**
 * Update one role
 * @private
 * @static
 * @param {RoleUpdate} data
 * @return {Promise<Role>} Created / Updated role
 * */
async function update({ id, name, permissions }) {
  // TODO AÑADIR PERMISSION SERVICE
  let existRole = await table.roles.count({ id });
  if (!existRole) throw new Error(`The role with the specified id does not exist`);

  existRole = await table.roles.count({ id_$ne: id, name });
  if (existRole) throw new Error(`Role with name '${name}' already exists`);

  const dataToCheckPermissions = _.map(permissions, (permission) => [
    permission.permissionName,
    permission.actionNames,
  ]);
  if (!(await permissionsService.manyPermissionsHasManyActions(dataToCheckPermissions)))
    throw new Error(`One or more permissions or his actions not exist`);

  return table.roles.transaction(async (transacting) => {
    leemons.log.info(`Creating role '${name}'`);
    const values = await Promise.all([
      removePermissionAll(id, transacting),
      table.roles.update({ id }, { name }, { transacting }),
    ]);

    await addPermissionMany(id, permissions, transacting);
    return values[1];
  });
}

module.exports = { update };
