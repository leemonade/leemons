const _ = require('lodash');
const { table } = require('../tables');

/**
 * Test function for example purposes
 * @public
 * @static
 * @param {string} anyId - Any id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function test(anyId, { transacting } = {}) {
  return await table.families.find({ transacting });
}

module.exports = { test };
