const _ = require('lodash');
const { table } = require('../tables');

const { validateAddCalendarConfig } = require('../../validations/forms');
const { addMany } = require('../center-calendar-configs');
const { detail } = require('./detail');

/**
 * Add calendar config
 * @public
 * @static
 * @param {string[]=} centers - Centers ids
 * @param {any} data - Calendar data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function add({ centers, ...data }, { transacting } = {}) {
  validateAddCalendarConfig({ centers, ...data });

  const response = await table.calendarConfigs.create(
    {
      ...data,
      schoolDays: JSON.stringify(data.schoolDays),
      notSchoolDays: JSON.stringify(data.notSchoolDays),
    },
    { transacting }
  );

  if (_.isArray(centers)) {
    await addMany(
      _.map(centers, (center) => ({ center, config: response.id })),
      { transacting }
    );
  }

  return detail(response.id, { transacting });
}

module.exports = { add };
