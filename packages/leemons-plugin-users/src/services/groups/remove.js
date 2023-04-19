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
async function remove(groupId, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await exist({ id: groupId }, true, { transacting });
      const groupUserAgents = await table.groupUserAgent.find(
        { group: groupId },
        { columns: ['id', 'user'] },
        { transacting }
      );
      const userAgentIdsInGroup = _.map(groupUserAgents, 'userAgent');
      const values = await Promise.all([
        table.group.delete({ id: groupId }, { transacting }),
        table.groupUserAgent.deleteMany({ group: groupId }, { transacting }),
        table.userAgent.updateMany(
          { id_$in: userAgentIdsInGroup },
          { reloadPermissions: true },
          { transacting }
        ),
      ]);
      return values[0];
    },
    table.userAgent,
    _transacting
  );
}

module.exports = { remove };
