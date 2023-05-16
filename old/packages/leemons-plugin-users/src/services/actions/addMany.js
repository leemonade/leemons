const _ = require('lodash');
const { add } = require('./add');

/**
 * Create multiple actions
 * @public
 * @static
 * @param {ActionAdd[]} data - Array of actions to add
 * @return {Promise<ManyResponse>} Created actions
 * */
async function addMany(data) {
  const response = await Promise.allSettled(_.map(data, (d) => add.call(this, d)));
  return global.utils.settledResponseToManyResponse(response);
}

module.exports = { addMany };
