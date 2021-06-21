const { table } = require('../tables');

/**
 * Check if user exists
 * @public
 * @static
 * @param {any} query
 * @param {boolean} throwErrorIfNotExists
 * @return {Promise<boolean>}
 * */
async function existUserAuth(query, throwErrorIfNotExists) {
  const count = await table.userAuth.count(query);
  if (throwErrorIfNotExists && !count) throw new Error('User auth not found');
  return !!count;
}

module.exports = {
  existUserAuth,
};
