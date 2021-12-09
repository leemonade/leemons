const _ = require('lodash');
const { table } = require('../tables');

const { validateAddCalendarConfig } = require('../../validations/forms');
const { addMany } = require('../center-calendar-configs');
const { add: addCalendar } = require('../calendar/add');
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
async function add({ centers, ...data }, { transacting: _transacting } = {}) {
  validateAddCalendarConfig({ centers, ...data });

  return global.utils.withTransaction(
    async (transacting) => {
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

      const calendars = await Promise.all([
        addCalendar.call(
          { calledFrom: leemons.plugin.prefixPN('') },
          leemons.plugin.prefixPN(`config.${response.id}.holidays_vacation`),
          {
            section: leemons.plugin.prefixPN(`config.${response.id}`),
            name: leemons.plugin.prefixPN(`holidays_vacation`),
            bgColor: '#b8e79c',
            borderColor: '#b8e79c',
          },
          { transacting }
        ),
        addCalendar.call(
          { calledFrom: leemons.plugin.prefixPN('') },
          leemons.plugin.prefixPN(`config.${response.id}.regional_holidays`),
          {
            section: leemons.plugin.prefixPN(`config.${response.id}`),
            name: leemons.plugin.prefixPN(`regional_holidays`),
            bgColor: '#d29ce7',
            borderColor: '#d29ce7',
          },
          { transacting }
        ),
        addCalendar.call(
          { calledFrom: leemons.plugin.prefixPN('') },
          leemons.plugin.prefixPN(`config.${response.id}.non_school_day`),
          {
            section: leemons.plugin.prefixPN(`config.${response.id}`),
            name: leemons.plugin.prefixPN(`non_school_day`),
            bgColor: '#e79ccf',
            borderColor: '#e79ccf',
          },
          { transacting }
        ),
      ]);

      await table.calendarConfigCalendars.createMany(
        _.map(calendars, (calendar) => ({ calendar: calendar.id, config: response.id })),
        { transacting }
      );

      return detail(response.id, { transacting });
    },
    table.calendars,
    _transacting
  );
}

module.exports = { add };
