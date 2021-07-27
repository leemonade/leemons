const { existUserAgent } = require('../users');
const { table } = require('../tables');
const { exist: userExist } = require('../users/exist');
const { exist: groupExist } = require('./exist');

/**
 * Remove one user from group
 * @public
 * @static
 * @param {string} groupId - Group id
 * @param {string} userAgentId - User auth id
 * @return {Promise<undefined>}
 * */
async function removeUser(groupId, userAgentId) {
  await Promise.all([groupExist({ id: groupId }, true), existUserAgent({ id: userAgentId }, true)]);

  const groupUserAgent = await table.groupUserAgent.count({
    group: groupId,
    userAgent: userAgentId,
  });
  if (groupUserAgent) {
    return table.groupUserAgent.transaction(async (transacting) => {
      const values = await Promise.all([
        table.groupUserAgent.delete({ group: groupId, userAgent: userAgentId }, { transacting }),
        table.userAgent.update({ id: userAgentId }, { reloadPermissions: true }, { transacting }),
      ]);
      return values[0];
    });
  }
  return undefined;
}

module.exports = { removeUser };
