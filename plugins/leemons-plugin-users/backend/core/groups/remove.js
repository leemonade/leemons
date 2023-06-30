const _ = require('lodash');
const { exist } = require('./exist');

/**
 * Remove group
 * @public
 * @static
 * @param {string} groupId - Group id
 * @return {Promise<undefined>}
 * */
async function remove({ groupId, ctx }) {
  await exist({ query: { _id: groupId }, throwErrorIfNotExists: true, ctx });
  const groupUserAgents = await ctx.tx.db.GroupUserAgent.find({ group: groupId })
    .select(['_id', 'user'])
    .lean();
  const userAgentIdsInGroup = _.map(groupUserAgents, 'userAgent');
  const values = await Promise.all([
    ctx.tx.db.Group.findByIdAndDelete(groupId),
    ctx.tx.db.GroupUserAgent.deleteMany({ group: groupId }),
    ctx.tx.db.UserAgent.updateMany({ id: userAgentIdsInGroup }, { reloadPermissions: true }),
  ]);
  return values[0];
}

module.exports = { remove };
