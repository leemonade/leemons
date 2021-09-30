const _ = require('lodash');
const { table } = require('../tables');
const { validateNotExistCalendarConfig } = require('../../validations/exists');

/**
 * List kanban columns
 * @public
 * @static
 * @param {string} id - ID
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function detail(id, { transacting } = {}) {
  await validateNotExistCalendarConfig(id, { transacting });
  const response = await table.calendarConfigs.findOne({ id }, { transacting });
  return {
    ...response,
    schoolDays: JSON.parse(response.schoolDays),
    notSchoolDays: JSON.parse(response.notSchoolDays),
  };
}

module.exports = { detail };
