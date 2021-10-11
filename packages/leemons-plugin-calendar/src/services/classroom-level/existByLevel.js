const _ = require('lodash');
const { table } = require('../tables');

/**
 *
 * @public
 * @static
 * @param {string} level - level
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function existByLevel(level, { transacting } = {}) {
  const count = await table.classroomLevelCalendars.count({ level }, { transacting });
  return !!count;
}

module.exports = { existByLevel };
