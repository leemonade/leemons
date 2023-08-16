const _ = require('lodash');
const { table } = require('../tables');
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
async function detail(id, { transacting } = {}) {
  await validateNotExistCalendarConfig(id, { transacting });
  const response = await table.calendarConfigs.findOne({ id }, { transacting });
  response.centers = [];

  const centersConfig = await listByConfigId(id, { transacting });
  if (centersConfig.length) {
    const centers = await leemons
      .getPlugin('users')
      .services.centers.list(0, 99999, { transacting });
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
