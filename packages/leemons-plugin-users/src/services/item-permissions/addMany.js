const _ = require('lodash');
const add = require('./add');

/**
 * Create multiple item permissions
 * @public
 * @static
 * @param {ItemPermission[]} data - Array of item permissions to add
 * @param {any=} transacting - DB Transaction
 * @return {Promise<ManyResponse>} Created permissions
 * */
async function addMany(data, { transacting } = {}) {
  const response = await Promise.allSettled(_.map(data, (d) => add.call(this, d, { transacting })));
  return global.utils.settledResponseToManyResponse(response);
}

module.exports = addMany;
