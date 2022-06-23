const _ = require('lodash');
const { table } = require('../tables');
const { getSuperAdminUserIds } = require('./getSuperAdminUserIds');

/**
 * Return the user for the id provided
 * @public
 * @static
 * @param {string|string[]} userId - User id
 * @return {Promise<User>}
 * */
async function detail(userId, { transacting } = {}) {
  let users = await table.users.find(
    { id_$in: _.isArray(userId) ? userId : [userId] },
    { transacting }
  );
  if (users.length !== (_.isArray(userId) ? userId : [userId]).length) {
    if (_.isArray(userId)) {
      throw new Error('One of users not found for the ids provided');
    } else {
      throw new Error('No user found for the id provided');
    }
  }

  const superAdminUsersIds = await getSuperAdminUserIds({ transacting });
  users = users.map((user) => ({ ...user, isSuperAdmin: superAdminUsersIds.includes(user.id) }));

  return _.isArray(userId) ? users : users[0];
}

module.exports = { detail };
