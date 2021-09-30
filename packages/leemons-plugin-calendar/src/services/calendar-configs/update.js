const { table } = require('../tables');

const { validateAddCalendarConfig } = require('../../validations/forms');
const { validateNotExistCalendarConfig } = require('../../validations/exists');

/**
 * Update calendar config
 * @public
 * @static
 * @param {any} id - Config id
 * @param {any} data - Config data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function update(id, data, { transacting } = {}) {
  validateAddCalendarConfig(data);

  await validateNotExistCalendarConfig(id, { transacting });
  const response = await table.calendarConfigs.update(
    { id },
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

module.exports = { update };
