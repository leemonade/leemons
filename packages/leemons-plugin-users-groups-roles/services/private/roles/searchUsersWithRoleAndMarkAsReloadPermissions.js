const _ = require('lodash');
const { table } = require('../tables');

/**
 * Searches for the users that have that role, the groups that have that role and the users
 * that are in that groups.
 * @private
 * @static
 * @param {string} roleId - Role id
 * @param {any} transacting - Database transaction
 * @return {Promise<any>}
 * */
async function searchUsersWithRoleAndMarkAsReloadPermissions(roleId, transacting) {
  // TODO SIN USAR
  // TODO ARREGLAR PARA QUE USE USER AUTH Y NO USERS
  const [userRoles, groupRoles] = await Promise.all([
    table.userRole.find({ role: roleId }, { columns: ['user'], transacting }),
    table.groupRole.find({ role: roleId }, { columns: ['group'], transacting }),
  ]);

  const groupUser = await table.groupUser.find(
    { group_$in: _.map(groupRoles, 'group') },
    { columns: ['user'], transacting }
  );

  const userIds = _.uniq(_.map(userRoles, 'user').concat(_.map(groupUser, 'user')));

  return table.users.updateMany({ id_$in: userIds }, { reloadPermissions: true }, { transacting });
}

module.exports = { searchUsersWithRoleAndMarkAsReloadPermissions };
