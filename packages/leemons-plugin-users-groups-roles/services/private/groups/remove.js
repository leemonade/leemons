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
  const groupUserAuths = await table.groupUserAuth.find({ group: groupId }, { columns: ['user'] });
  const userAuthIdsInGroup = _.map(groupUserAuths, 'userAuth');
  return table.groupUserAuth.transaction(async () => {
    const values = await Promise.all([
      table.group.delete({ id: groupId }),
      table.userAuth.updateMany({ id_$in: userAuthIdsInGroup }, { reloadPermissions: true }),
    ]);
    return values[0];
  });
}

module.exports = { remove };
