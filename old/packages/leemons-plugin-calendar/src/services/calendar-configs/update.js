const _ = require('lodash');
const { table } = require('../tables');

const { validateAddCalendarConfig } = require('../../validations/forms');
const { validateNotExistCalendarConfig } = require('../../validations/exists');
const { removeByConfigId, addMany } = require('../center-calendar-configs');
const { detail } = require('./detail');

/**
 * Update calendar config
 * @public
 * @static
 * @param {any} id - Config id
 * @param {any} centers - Config centers
 * @param {any} data - Config data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function update(id, { centers, ...data }, { transacting: _transacting } = {}) {
  validateAddCalendarConfig({ centers, ...data });

  return global.utils.withTransaction(
    async (transacting) => {
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

      await removeByConfigId(id, { transacting });
      if (_.isArray(centers)) {
        await addMany(
          _.map(centers, (center) => ({ center, config: response.id })),
          { transacting }
        );
      }

      return detail(response.id, { transacting });
    },
    table.calendars,
    _transacting
  );
}

module.exports = { update };
