/* eslint-disable prefer-template */
const _ = require('lodash');
const exist = require('./exist');

const { validateRoleType } = require('../../validations/exists');
const { manyPermissionsHasManyActions } = require('../permissions/manyPermissionsHasManyActions');
const { addPermissionMany } = require('./addPermissionMany');
const { removePermissionAll } = require('./permissions/removePermissionAll');
const { table } = require('../tables');

/**
 * Update one role
 * @private
 * @static
 * @param {RoleUpdate} data
 * @param {any=} _transacting - DB Transaction
 * @return {Promise<Role>} Created / Updated role
 * */
async function update(
  { id, name, type, description, center, permissions },
  { transacting: _transacting } = {}
) {
  validateRoleType(type, this.calledFrom);
  return global.utils.withTransaction(
    async (transacting) => {
      if (!(await exist(id, { transacting })))
        throw new Error(`The role with the specified id does not exist`);

      const query = {
        name,
        type,
      };

      if (center) {
        const rolesInCenter = await table.roleCenter.find(
          { center },
          {
            columns: ['role'],
            transacting,
          }
        );
        const ids = _.map(rolesInCenter, 'role');
        const index = ids.indexOf(id);
        if (index >= 0) ids.splice(index, 1);
        query.id_$in = ids;
      } else {
        query.id_$ne = id;
      }

      const existRole = await table.roles.count(query, { transacting });
      if (existRole) {
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

      leemons.log.info(`Updating role '${name}'`);
      const [role, roleCenter, n] = await Promise.all([
        table.roles.update({ id }, { name, type, description }, { transacting }),
        table.roleCenter.findOne({ role: id }, { transacting }),
        removePermissionAll(id, { transacting }),
      ]);

      // ES: Si nos pasan que center es explicitamente null significa que quieren quitarle el centro al rol y si viene centro es que quieres actualizarlo
      if (_.isNull(center) || center)
        await table.roleCenter.delete({ id: roleCenter.id }, { transacting });
      if (center) await table.roleCenter.create({ role: role.id, center }, { transacting });

      await addPermissionMany.call(this, id, permissions, { transacting });
      return role;
    },
    table.roles,
    _transacting
  );
}

module.exports = { update };
