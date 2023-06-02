const { existUserAgent } = require('../user-agents/existUserAgent');
const { exist: groupExist } = require('./exist');
const { checkIfCanCreateUserAgentInGroup } = require('./checkIfCanCreateNUserAgentsInGroup');

/**
 * Add one user auth to group if not already in group
 * If you are in, continue without errors
 * @public
 * @static
 * @param {string} groupId - Group id
 * @param {string} userAgentId - User auth id
 * @return {Promise<undefined>}
 * */
async function addUserAgent({ groupId, userAgentId, checksDisabled, ctx }) {
  if (!checksDisabled) {
    await Promise.all([
      groupExist({ ctx, query: { _id: groupId }, throwErrorIfNotExists: true }),
      existUserAgent({ ctx, query: { _id: userAgentId }, throwErrorIfNotExists: true }),
    ]);
  }
  const groupUser = await ctx.tx.db.GroupUserAgent.countDocuments({
    group: groupId,
    userAgent: userAgentId,
  });
  if (!groupUser) {
    await checkIfCanCreateUserAgentInGroup({ userAgentId, groupId, ctx });

    const values = await Promise.all([
      ctx.tx.db.GroupUserAgent.create({ group: groupId, userAgent: userAgentId }),
      ctx.tx.db.UserAgent.update({ _id: userAgentId }, { reloadPermissions: true }),
    ]);
    return values[0];
  }
  return groupUser;
}

module.exports = { addUserAgent };
