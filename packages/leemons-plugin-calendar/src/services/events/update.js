const _ = require('lodash');
const { table } = require('../tables');

const { validateUpdateEvent } = require('../../validations/forms');
const { addNexts } = require('../notifications');
const { removeAll } = require('../notifications/removeAll');
const { addToCalendar } = require('./addToCalendar');

/**
 * Add calendar with the provided key if not already exists
 * @public
 * @static
 * @param {string} id - key
 * @param {any} data - Event data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function update(id, data, { calendar, transacting: _transacting } = {}) {
  validateUpdateEvent(data);

  // eslint-disable-next-line no-param-reassign
  if (data.startDate) data.startDate = data.startDate.slice(0, 19).replace('T', ' ');
  // eslint-disable-next-line no-param-reassign
  if (data.endDate) data.endDate = data.endDate.slice(0, 19).replace('T', ' ');

  return global.utils.withTransaction(
    async (transacting) => {
      const toSave = {
        ...data,
        data: _.isObject(data.data) ? JSON.stringify(data.data) : data.data,
      };
      if (calendar) {
        const calendars = _.isArray(calendar) ? calendar : [calendar];
        await table.eventCalendar.deleteMany({ event: id }, { transacting });
        await addToCalendar(id, calendars, { transacting });
      }
      const event = await table.events.update({ id }, toSave, { transacting });

      await removeAll(event.id, { transacting });
      await addNexts(event.id, { transacting });
      return { ...event, data: _.isString(event.data) ? JSON.parse(event.data) : event.data };
    },
    table.calendars,
    _transacting
  );
}

module.exports = { update };
