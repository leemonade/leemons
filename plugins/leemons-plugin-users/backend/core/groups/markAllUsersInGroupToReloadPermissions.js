const _ = require('lodash');

async function markAllUsersInGroupToReloadPermissions({ groupId, ctx }) {
  const groupUsers = await ctx.tx.db.GroupUserAgent.find({ group: groupId })
    .select(['userAgent'])
    .lean();

  return ctx.tx.db.UserAgent.updateMany(
    { id: _.map(groupUsers, 'userAgent') },
    { reloadPermissions: true }
  );
}

module.exports = { markAllUsersInGroupToReloadPermissions };
