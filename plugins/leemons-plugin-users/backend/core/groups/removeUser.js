const { existUserAgent } = require('../user-agents/existUserAgent');
const { exist: groupExist } = require('./exist');

/**
 * Remove one user from group
 * @public
 * @static
 * @param {string} groupId - Group id
 * @param {string} userAgentId - User auth id
 * @return {Promise<undefined>}
 * */
async function removeUser({ groupId, userAgentId, checksDisabled, ctx } = {}) {
  if (!checksDisabled) {
    await Promise.all([
      groupExist({ query: { _id: groupId }, throwErrorIfNotExists: true, ctx }),
      existUserAgent({ query: { _id: userAgentId }, throwErrorIfNotExists: true, ctx }),
    ]);
  }

  const groupUserAgent = await ctx.tx.db.GroupUserAgent.countDocuments({
    group: groupId,
    userAgent: userAgentId,
  });
  if (groupUserAgent) {
    const values = await Promise.all([
      ctx.tx.db.GroupUserAgent.deleteOne({ group: groupId, userAgent: userAgentId }),
      ctx.tx.db.UserAgent.findByIdAndUpdate(userAgentId, { reloadPermissions: true }),
    ]);
    return values[0];
  }
  return undefined;
}

module.exports = { removeUser };
