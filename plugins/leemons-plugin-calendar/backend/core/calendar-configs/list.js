const _ = require('lodash');

/**
 * List kanban columns
 * @public
 * @static
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function list({ ctx }) {
  const [responses, centersConfigs, centers] = await Promise.all([
    ctx.tx.db.CalendarConfigs.find({}).lean(),
    ctx.tx.db.CenterCalendarConfigs.find({}).lean(),
    ctx.tx.call('users.centers.list', { page: 0, size: 99999 }),
  ]);

  const centersConfigsByConfig = _.groupBy(centersConfigs, 'group');

  return _.map(responses, (response) => ({
    ...response,
    schoolDays: JSON.parse(response.schoolDays || null),
    notSchoolDays: JSON.parse(response.notSchoolDays || null),
    centers: _.intersectionBy(
      centersConfigsByConfig[response.id],
      centers,
      (item) => item.center || item.id
    ),
  }));
}

module.exports = { list };
