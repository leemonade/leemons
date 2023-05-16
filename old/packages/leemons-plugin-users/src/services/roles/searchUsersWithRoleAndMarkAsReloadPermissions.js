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
  const [userAgents, groupRoles] = await Promise.all([
    table.userAgent.find({ role: roleId }, { columns: ['id'], transacting }),
    table.groupRole.find({ role: roleId }, { columns: ['id', 'group'], transacting }),
  ]);

  const groupUser = await table.groupUserAgent.find(
    { group_$in: _.map(groupRoles, 'group') },
    { columns: ['id', 'userAgent'], transacting }
  );

  const userIds = _.uniq(_.map(userAgents, 'id').concat(_.map(groupUser, 'userAgent')));

  return table.userAgent.updateMany(
    { id_$in: userIds },
    { reloadPermissions: true },
    { transacting }
  );
}

module.exports = { searchUsersWithRoleAndMarkAsReloadPermissions };
