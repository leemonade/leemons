const { existUserAgent } = require('../user-agents/existUserAgent');
const { exist: userExist } = require('../users/exist');
const { exist: groupExist } = require('./exist');
const { table } = require('../tables');

/**
 * Add one user auth to group if not already in group
 * If you are in, continue without errors
 * @public
 * @static
 * @param {string} groupId - Group id
 * @param {string} userAgentId - User auth id
 * @return {Promise<undefined>}
 * */
async function addUserAgent(groupId, userAgentId) {
  await Promise.all([groupExist({ id: groupId }, true), existUserAgent({ id: userAgentId }, true)]);
  const groupUser = await table.groupUserAgent.count({ group: groupId, userAgent: userAgentId });
  if (!groupUser) {
    return table.groupUserAgent.transaction(async (transacting) => {
      const values = await Promise.all([
        table.groupUserAgent.create({ group: groupId, userAgent: userAgentId }, { transacting }),
        table.userAgent.update({ id: userAgentId }, { reloadPermissions: true }, { transacting }),
      ]);
      return values[0];
    });
  }
  return groupUser;
}

module.exports = { addUserAgent };
