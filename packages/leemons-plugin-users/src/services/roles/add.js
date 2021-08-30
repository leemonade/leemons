const _ = require('lodash');
const existByName = require('./existByName');
const { validateRoleType } = require('../../validations/exists');
const { manyPermissionsHasManyActions } = require('../permissions/manyPermissionsHasManyActions');
const { addPermissionMany } = require('./addPermissionMany');
const { table } = require('../tables');
const { hasRole } = require('../profiles/hasRole');

/**
 * Create one role
 * @private
 * @static
 * @param {RoleAdd} data
 * @param {any=} _transacting -  DB Transaction
 * @return {Promise<Role>} Created / Updated role
 * */
async function add(
  { name, type, description, center, profile, permissions },
  { transacting: _transacting } = {}
) {
  validateRoleType(type, this.calledFrom);
  return global.utils.withTransaction(
    async (transacting) => {
      if (await existByName(name, type, center, { transacting })) {
        const error = `Role with name '${name}' and type '${type}' already exists${
          center ? ' in center ' + center : ''
        }`;
        throw new Error(error);
      }

      const dataToCheckPermissions = _.map(permissions, (permission) => [
        permission.permissionName,
        permission.actionNames,
      ]);

      if (!(await manyPermissionsHasManyActions(dataToCheckPermissions, { transacting })))
        throw new Error(`One or more permissions or his actions not exist`);

      leemons.log.info(`Creating role '${name}'`);

      const role = await table.roles.create(
        {
          name,
          type,
          description,
          uri: global.utils.slugify(name, { lower: true }),
        },
        { transacting }
      );
      if (center) await table.roleCenter.create({ role: role.id, center }, { transacting });
      if (profile) await table.profileRole.create({ role: role.id, profile }, { transacting });

      await addPermissionMany.call(this, role.id, permissions, { transacting });
      return role;
    },
    table.roles,
    _transacting
  );
}

module.exports = { add };
