const { existUserAgent } = require('../user-agents/existUserAgent');
const { exist: groupExist } = require('./exist');
const { table } = require('../tables');
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
async function addUserAgent(
  groupId,
  userAgentId,
  { checksDisabled, transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      if (!checksDisabled) {
        await Promise.all([
          groupExist({ id: groupId }, true, { transacting }),
          existUserAgent({ id: userAgentId }, true, { transacting }),
        ]);
      }
      const groupUser = await table.groupUserAgent.count(
        { group: groupId, userAgent: userAgentId },
        { transacting }
      );
      if (!groupUser) {
        await checkIfCanCreateUserAgentInGroup(userAgentId, groupId, { transacting });

        const values = await Promise.all([
          table.groupUserAgent.create({ group: groupId, userAgent: userAgentId }, { transacting }),
          table.userAgent.update({ id: userAgentId }, { reloadPermissions: true }, { transacting }),
        ]);
        return values[0];
      }
      return groupUser;
    },
    table.userAgent,
    _transacting
  );
}

module.exports = { addUserAgent };
