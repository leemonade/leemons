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
  // TODO ARREGLAR PARA QUE USE USER AUTH Y NO USERS
  await exist({ id: groupId }, true);
  const groupUsers = await table.groupUser.find({ group: groupId }, { columns: ['user'] });
  const userIdsInGroup = _.map(groupUsers, 'user');
  return table.groupUser.transaction(async () => {
    const values = await Promise.all([
      table.group.delete({ id: groupId }),
      table.users.updateMany({ id_$in: userIdsInGroup }, { reloadPermissions: true }),
    ]);
    return values[0];
  });
}

module.exports = { remove };
