const { exist: userExist } = require('../users/exist');
const { exist: groupExist } = require('./exist');
const { table } = require('../tables');

/**
 * Add one user to group if not already in group
 * If you are in, continue without errors
 * @public
 * @static
 * @param {string} groupId - Group id
 * @param {string} userId - User id
 * @return {Promise<undefined>}
 * */
async function addUser(groupId, userId) {
  // TODO ARREGLAR PARA QUE USE USER AUTH Y NO USERS
  await Promise.all([groupExist({ id: groupId }, true), userExist({ id: userId }, true)]);
  const groupUser = await table.groupUser.count({ group: groupId, user: userId });
  if (!groupUser) {
    return table.groupUser.transaction(async () => {
      const values = await Promise.all([
        table.groupUser.create({ group: groupId, user: userId }),
        table.users.update({ id: userId }, { reloadPermissions: true }),
      ]);
      return values[0];
    });
  }
  return groupUser;
}

module.exports = { addUser };
