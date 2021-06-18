const _ = require('lodash');
const { update } = require('./update');

/**
 * Update multiple permissions
 * @public
 * @static
 * @param {PermissionAdd[]} data - Array of permissions to update
 * @return {Promise<ManyResponse>} Updated permissions
 * */
async function updateMany(data) {
  const response = await Promise.allSettled(_.map(data, (d) => update(d)));
  return global.utils.settledResponseToManyResponse(response);
}

module.exports = { updateMany };
