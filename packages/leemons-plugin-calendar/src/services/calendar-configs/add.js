const { table } = require('../tables');

const { validateAddCalendarConfig } = require('../../validations/forms');

/**
 * Add calendar config
 * @public
 * @static
 * @param {any} data - Event data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function add(data, { transacting } = {}) {
  validateAddCalendarConfig(data);

  const response = await table.calendarConfigs.create(
    {
      ...data,
      schoolDays: JSON.stringify(data.schoolDays),
      notSchoolDays: JSON.stringify(data.notSchoolDays),
    },
    { transacting }
  );
  return {
    ...response,
    schoolDays: JSON.parse(response.schoolDays),
    notSchoolDays: JSON.parse(response.notSchoolDays),
  };
}

module.exports = { add };
