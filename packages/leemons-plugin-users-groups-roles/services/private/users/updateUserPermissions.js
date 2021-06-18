const _ = require('lodash');
const { table } = require('../tables');

/**
 * Updates the permissions of the user if it is marked as reload permissions according to their
 * roles and the roles of the groups to which they belong.
 * @public
 * @static
 * @param {string} userId - User id
 * @return {Promise<any>}
 * */
async function updateUserPermissions(userId) {
  // TODO ARREGLAR PARA QUE USE USER AUTH Y NO USERS
  // First we search for all user roles
  // TODO ARREGLAR QUE SE GENEREN LOS PERMISOS
  return table.user.transaction(async (transacting) => {
    const [userRoles, groupUsers] = await Promise.all([
      table.userRole.find({ user: userId }, { columns: ['role'], transacting }),
      table.groupUser.find({ user: userId }, { columns: ['group'], transacting }),
      table.userPermission.deleteMany({ user: userId }, { transacting }),
      table.users.update({ id: userId }, { reloadPermissions: false }, { transacting }),
    ]);
    const groupRoles = await table.groupRole.find(
      { group_$in: _.map(groupUsers, 'group') },
      { columns: ['role'], transacting }
    );

    const roleIds = _.uniq(_.map(userRoles, 'role').concat(_.map(groupRoles, 'role')));

    const rolePermissions = await table.rolePermission.find(
      { role_$in: roleIds },
      {
        columns: ['permission'],
        transacting,
      }
    );

    return table.userPermission.createMany(
      _.map(rolePermissions, (rolePermission) => ({
        user: userId,
        permission: rolePermission.permission,
      })),
      { transacting }
    );
  });
}

module.exports = { updateUserPermissions };
