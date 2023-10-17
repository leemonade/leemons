const _ = require('lodash');
const { validateNotExistCalendarConfig } = require('../../validations/exists');
const { listByConfigId } = require('../center-calendar-configs');

/**
 * List kanban columns
 * @public
 * @static
 * @param {string} id - ID
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function detail({ id, ctx }) {
  await validateNotExistCalendarConfig({ id, ctx });
  const response = await ctx.tx.db.CalendarConfigs.findOne({ id }).lean();
  response.centers = [];

  const centersConfig = await listByConfigId({ config: id, ctx });
  if (centersConfig.length) {
    const centers = await ctx.tx.call('users.centers.list', { page: 0, size: 99999 });
    response.centers = _.intersectionBy(
      centers.items,
      centersConfig,
      (item) => item.center || item.id
    );
  }
  return {
    ...response,
    schoolDays: JSON.parse(response.schoolDays),
    notSchoolDays: JSON.parse(response.notSchoolDays),
  };
}

module.exports = { detail };
