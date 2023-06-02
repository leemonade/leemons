const _ = require('lodash');
const { remove } = require('./remove');

/**
 * Delete multiple permissions
 * @public
 * @static
 * @param {string[]} permissionNames - Array of permissions to delete
 * @return {Promise<ManyResponse>} Deleted permissions
 * */
async function removeMany(permissionNames) {
  const response = await Promise.allSettled(_.map(permissionNames, (d) => remove.call(this, d)));
  return global.utils.settledResponseToManyResponse(response);
}

module.exports = { removeMany };
