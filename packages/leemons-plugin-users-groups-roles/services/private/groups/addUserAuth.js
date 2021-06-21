const { existUserAuth } = require('../users');
const { exist: userExist } = require('../users/exist');
const { exist: groupExist } = require('./exist');
const { table } = require('../tables');

/**
 * Add one user auth to group if not already in group
 * If you are in, continue without errors
 * @public
 * @static
 * @param {string} groupId - Group id
 * @param {string} userAuthId - User auth id
 * @return {Promise<undefined>}
 * */
async function addUserAuth(groupId, userAuthId) {
  await Promise.all([groupExist({ id: groupId }, true), existUserAuth({ id: userAuthId }, true)]);
  const groupUser = await table.groupUserAuth.count({ group: groupId, userAuth: userAuthId });
  if (!groupUser) {
    return table.groupUserAuth.transaction(async () => {
      const values = await Promise.all([
        table.groupUserAuth.create({ group: groupId, userAuth: userAuthId }),
        table.userAuth.update({ id: userAuthId }, { reloadPermissions: true }),
      ]);
      return values[0];
    });
  }
  return groupUser;
}

module.exports = { addUserAuth };
