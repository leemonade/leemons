const _ = require('lodash');

/**
 * Searches for the users that have that role, the groups that have that role and the users
 * that are in that groups.
 * @private
 * @static
 * @param {string} roleId - Role id
 * @param {any} transacting - Database transaction
 * @return {Promise<any>}
 * */
async function searchUsersWithRoleAndMarkAsReloadPermissions({ roleId, ctx }) {
  const [userAgents, groupRoles] = await Promise.all([
    ctx.tx.db.UserAgent.find({ role: roleId }).select(['id']).lean(),
    ctx.tx.db.GroupRole.find({ role: roleId }).select(['id', 'group']).lean(),
  ]);

  const groupUser = await ctx.tx.db.GroupUserAgent.find({
    group: _.map(groupRoles, 'group'),
  })
    .select(['id', 'userAgent'])
    .lean();

  const userIds = _.uniq(_.map(userAgents, 'id').concat(_.map(groupUser, 'userAgent')));

  return ctx.tx.db.UserAgent.updateMany(
    { id: userIds },
    { reloadPermissions: true },
    { new: true }
  );
}

module.exports = { searchUsersWithRoleAndMarkAsReloadPermissions };
