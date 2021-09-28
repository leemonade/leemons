const _ = require('lodash');
const { table } = require('../tables');

/**
 * Check if the event id already exists
 * @public
 * @static
 * @param {string} id - Id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function exist(id, { transacting } = {}) {
  const count = await table.events.count({ id }, { transacting });
  return !!count;
}

module.exports = { exist };
