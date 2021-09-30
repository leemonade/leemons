const _ = require('lodash');
const { table } = require('../tables');

/**
 * List kanban columns
 * @public
 * @static
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function list({ transacting } = {}) {
  const responses = await table.calendarConfigs.find({}, { transacting });
  return _.map(responses, (response) => ({
    ...response,
    schoolDays: JSON.parse(response.schoolDays),
    notSchoolDays: JSON.parse(response.notSchoolDays),
  }));
}

module.exports = { list };
