const { table } = require('../tables');

/**
 * Return the user for the id provided
 * @public
 * @static
 * @param {string} userId - User id
 * @return {Promise<User>}
 * */
async function detail(userId) {
  const user = await table.users.findOne({ id: userId });
  if (!user) throw new Error('No user found for the id provided');
  return user;
}

module.exports = { detail };
