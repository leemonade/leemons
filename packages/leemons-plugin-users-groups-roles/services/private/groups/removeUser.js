const { existUserAuth } = require('../users');
const { table } = require('../tables');
const { exist: userExist } = require('../users/exist');
const { exist: groupExist } = require('./exist');

/**
 * Remove one user from group
 * @public
 * @static
 * @param {string} groupId - Group id
 * @param {string} userAuthId - User auth id
 * @return {Promise<undefined>}
 * */
async function removeUser(groupId, userAuthId) {
  await Promise.all([groupExist({ id: groupId }, true), existUserAuth({ id: userAuthId }, true)]);

  const groupUserAuth = await table.groupUserAuth.count({ group: groupId, userAuth: userAuthId });
  if (groupUserAuth) {
    return table.groupUserAuth.transaction(async () => {
      const values = await Promise.all([
        table.groupUserAuth.delete({ group: groupId, userAuth: userAuthId }),
        table.userAuth.update({ id: userAuthId }, { reloadPermissions: true }),
      ]);
      return values[0];
    });
  }
  return undefined;
}

module.exports = { removeUser };
