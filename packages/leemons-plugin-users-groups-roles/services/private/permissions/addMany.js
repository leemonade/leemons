const _ = require('lodash');
const { add } = require('./add');

/**
 * Create multiple permissions
 * @public
 * @static
 * @param {PermissionAdd[]} data - Array of permissions to add
 * @return {Promise<ManyResponse>} Created permissions
 * */
async function addMany(data) {
  const response = await Promise.allSettled(_.map(data, (d) => add.call(this, d)));
  return global.utils.settledResponseToManyResponse(response);
}

module.exports = { addMany };
