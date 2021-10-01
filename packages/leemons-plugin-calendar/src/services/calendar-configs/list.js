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
  const [responses, centersConfigs, centers] = await Promise.all([
    table.calendarConfigs.find({}, { transacting }),
    table.centerCalendarConfigs.find({}, { transacting }),
    leemons.getPlugin('users').services.centers.list(0, 99999, { transacting }),
  ]);

  const centersConfigsByConfig = _.groupBy(centersConfigs, 'group');

  return _.map(responses, (response) => ({
    ...response,
    schoolDays: JSON.parse(response.schoolDays),
    notSchoolDays: JSON.parse(response.notSchoolDays),
    centers: _.intersectionBy(
      centersConfigsByConfig[response.id],
      centers,
      (item) => item.center || item.id
    ),
  }));
}

module.exports = { list };
