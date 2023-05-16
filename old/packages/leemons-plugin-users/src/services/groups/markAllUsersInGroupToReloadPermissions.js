const _ = require('lodash');
const { table } = require('../tables');

async function markAllUsersInGroupToReloadPermissions(groupId, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const groupUsers = await table.groupUserAgent.find({ group: groupId }, { transacting });

      return table.userAgent.updateMany(
        { id_$in: _.map(groupUsers, 'userAgent') },
        { reloadPermissions: true },
        { transacting }
      );
    },
    table.userAgent,
    _transacting
  );
}

module.exports = { markAllUsersInGroupToReloadPermissions };
