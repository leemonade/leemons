const _ = require('lodash');

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
async function update({ id, centers, ctx, ...data }) {
  validateAddCalendarConfig({ centers, ...data });

  await validateNotExistCalendarConfig({ id, ctx });
  const response = await ctx.tx.db.CalendarConfigs.findOneAndUpdate(
    { id },
    {
      ...data,
      schoolDays: JSON.stringify(data.schoolDays),
      notSchoolDays: JSON.stringify(data.notSchoolDays),
    },
    { new: true, lean: true }
  );

  await removeByConfigId({ configId: id, ctx });
  if (_.isArray(centers)) {
    await addMany({ items: _.map(centers, (center) => ({ center, config: response.id })), ctx });
  }

  return detail({ id: response.id, ctx });
}

module.exports = { update };
