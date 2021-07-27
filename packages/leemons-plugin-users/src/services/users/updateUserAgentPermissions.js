const _ = require('lodash');
const { existUserAgent } = require('./existUserAgent');
const { table } = require('../tables');

/**
 * EN:
 * Updates the permissions of the user if it is marked as reload permissions according to their
 * roles and the roles of the groups to which they belong.
 *
 * ES:
 * Borra todos los permisos que ya tuviera el usuario que vinieran desde un rol y vuelve a generar
 * todos los permisos desde los roles en los que esta el usuario
 *
 * @public
 * @static
 * @param {string} userAgentId - User auth id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function updateUserAgentPermissions(userAgentId, { transacting: _transacting } = {}) {
  await existUserAgent({ id: userAgentId }, true, { transacting: _transacting });
  return global.utils.withTransaction(
    async (transacting) => {
      const [groupUserAgent, userAgent] = await Promise.all([
        table.groupUserAgent.find({ userAgent: userAgentId }, { columns: ['group'], transacting }),
        table.userAgent.update({ id: userAgentId }, { reloadPermissions: false }, { transacting }),
        table.userAgentPermission.deleteMany(
          {
            userAgent: userAgentId,
            role_$null: false,
          },
          { transacting }
        ),
      ]);

      const groupRoles = await table.groupRole.find(
        { group_$in: _.map(groupUserAgent, 'group') },
        { columns: ['role'], transacting }
      );

      const roleIds = _.uniq([userAgent.role].concat(_.map(groupRoles, 'role')));

      const [rolePermissions, roleCenter] = await Promise.all([
        table.rolePermission.find({ role_$in: roleIds }, { transacting }),
        table.roleCenter.find({ role_$in: roleIds }, { transacting }),
      ]);

      const roleCenterByRole = _.keyBy(roleCenter, 'role');

      return table.userAgentPermission.createMany(
        _.map(rolePermissions, (rolePermission) => ({
          userAgent: userAgentId,
          role: rolePermission.role,
          permissionName: rolePermission.permissionName,
          actionName: rolePermission.actionName,
          target: rolePermission.target,
          center: roleCenterByRole[rolePermission.role]
            ? roleCenterByRole[rolePermission.role].center
            : null,
        })),
        { transacting }
      );
    },
    table.userAgent,
    _transacting
  );
}

module.exports = { updateUserAgentPermissions };
