const { table } = require('../tables');

/**
 * Check if user exists
 * @public
 * @static
 * @param {any} query
 * @param {boolean} throwErrorIfNotExists
 * @return {Promise<boolean>}
 * */
async function exist(query, throwErrorIfNotExists) {
  const count = await table.users.count(query);
  if (throwErrorIfNotExists && !count) throw new Error('User not found');
  return !!count;
}

module.exports = {
  exist,
};
