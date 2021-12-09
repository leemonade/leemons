const { table } = require('../tables');

/**
 * Check if the calendar key already exists
 * @public
 * @static
 * @param {string} id - id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function exist(id, { transacting } = {}) {
  const count = await table.calendars.count({ id }, { transacting });
  return !!count;
}

module.exports = { exist };
