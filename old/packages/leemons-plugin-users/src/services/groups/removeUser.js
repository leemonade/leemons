const { existUserAgent } = require('../user-agents/existUserAgent');
const { table } = require('../tables');
const { exist: groupExist } = require('./exist');

/**
 * Remove one user from group
 * @public
 * @static
 * @param {string} groupId - Group id
 * @param {string} userAgentId - User auth id
 * @return {Promise<undefined>}
 * */
async function removeUser(
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

      const groupUserAgent = await table.groupUserAgent.count(
        {
          group: groupId,
          userAgent: userAgentId,
        },
        { transacting }
      );
      if (groupUserAgent) {
        const values = await Promise.all([
          table.groupUserAgent.delete({ group: groupId, userAgent: userAgentId }, { transacting }),
          table.userAgent.update({ id: userAgentId }, { reloadPermissions: true }, { transacting }),
        ]);
        return values[0];
      }
      return undefined;
    },
    table.userAgent,
    _transacting
  );
}

module.exports = { removeUser };
