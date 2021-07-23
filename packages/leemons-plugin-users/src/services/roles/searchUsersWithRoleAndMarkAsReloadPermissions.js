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
async function searchUsersWithRoleAndMarkAsReloadPermissions(roleId, { transacting } = {}) {
  const [userAuths, groupRoles] = await Promise.all([
    table.userAuth.find({ role: roleId }, { columns: ['id'], transacting }),
    table.groupRole.find({ role: roleId }, { columns: ['group'], transacting }),
  ]);

  const groupUser = await table.groupUserAuth.find(
    { group_$in: _.map(groupRoles, 'group') },
    { columns: ['userAuth'], transacting }
  );

  const userIds = _.uniq(_.map(userAuths, 'id').concat(_.map(groupUser, 'userAuth')));

  return table.userAuth.updateMany(
    { id_$in: userIds },
    { reloadPermissions: true },
    { transacting }
  );
}

module.exports = searchUsersWithRoleAndMarkAsReloadPermissions;
