const _ = require('lodash');
const { table } = require('../tables');
const { exist } = require('./exist');

/**
 * Remove group
 * @public
 * @static
 * @param {string} groupId - Group id
 * @return {Promise<undefined>}
 * */
async function remove(groupId) {
  await exist({ id: groupId }, true);
  const groupUserAgents = await table.groupUserAgent.find(
    { group: groupId },
    { columns: ['user'] }
  );
  const userAgentIdsInGroup = _.map(groupUserAgents, 'userAgent');
  return table.groupUserAgent.transaction(async () => {
    const values = await Promise.all([
      table.group.delete({ id: groupId }),
      table.userAgent.updateMany({ id_$in: userAgentIdsInGroup }, { reloadPermissions: true }),
    ]);
    return values[0];
  });
}

module.exports = { remove };
