const _ = require('lodash');

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
async function add({ centers, ctx, ...data }) {
  validateAddCalendarConfig({ centers, ...data });

  let response = await ctx.tx.db.CalendarConfigs.create({
    ...data,
    schoolDays: JSON.stringify(data.schoolDays),
    notSchoolDays: JSON.stringify(data.notSchoolDays),
  });
  response = response.toObject();

  if (_.isArray(centers)) {
    await addMany({ items: _.map(centers, (center) => ({ center, config: response.id })), ctx });
  }

  const calendars = await Promise.all([
    addCalendar({
      key: ctx.prefixPN(`config.${response.id}.holidays_vacation`),
      config: {
        section: leemons.plugin.prefixPN(`config.${response.id}`),
        name: leemons.plugin.prefixPN(`holidays_vacation`),
        bgColor: '#b8e79c',
        borderColor: '#b8e79c',
      },
      ctx: {
        ...ctx,
        callerPlugin: ctx.prefixPN(''),
      },
    }),
    addCalendar({
      key: ctx.prefixPN(`config.${response.id}.regional_holidays`),
      config: {
        section: leemons.plugin.prefixPN(`config.${response.id}`),
        name: leemons.plugin.prefixPN(`regional_holidays`),
        bgColor: '#d29ce7',
        borderColor: '#d29ce7',
      },
      ctx: {
        ...ctx,
        callerPlugin: ctx.prefixPN(''),
      },
    }),
    addCalendar({
      key: ctx.prefixPN(`config.${response.id}.non_school_day`),
      config: {
        section: leemons.plugin.prefixPN(`config.${response.id}`),
        name: leemons.plugin.prefixPN(`non_school_day`),
        bgColor: '#e79ccf',
        borderColor: '#e79ccf',
      },
      ctx: {
        ...ctx,
        callerPlugin: ctx.prefixPN(''),
      },
    }),
  ]);

  await ctx.tx.db.CalendarConfigCalendars.insertMany(
    _.map(calendars, (calendar) => ({ calendar: calendar.id, config: response.id }))
  );

  return detail({ id: response.id, ctx });
}

module.exports = { add };
