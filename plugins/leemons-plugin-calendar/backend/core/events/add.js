const _ = require('lodash');

const { validateAddEvent } = require('../../validations/forms');
const { detailByKey } = require('../calendar/detailByKey');
const { addNexts } = require('../notifications');
const { validateNotExistEventTypeKey } = require('../../validations/exists');
const { getPermissionConfig } = require('./getPermissionConfig');
const { addToCalendar } = require('./addToCalendar');

/**
 * Add calendar with the provided key if not already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {any} data - Event data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function add({ key, data, ignoreType, ctx }) {
  const keys = _.isArray(key) ? key : [key];
  validateAddEvent(data);

  // eslint-disable-next-line no-param-reassign
  if (data.startDate) data.startDate = data.startDate.slice(0, 19).replace('T', ' ');
  // eslint-disable-next-line no-param-reassign
  if (data.endDate) data.endDate = data.endDate.slice(0, 19).replace('T', ' ');

  if (!ignoreType) await validateNotExistEventTypeKey({ key: data.type, ctx });

  let event = await ctx.tx.db.Events.create({
    ...data,
    data: _.isObject(data.data) ? JSON.stringify(data.data) : data.data,
  });
  event = event.toObject();

  const calendars = await Promise.all(_.map(keys, (k) => detailByKey({ key: k, ctx })));

  await addToCalendar({ eventIds: event.id, calendarIds: _.map(calendars, 'id'), ctx });

  const permissionConfig = getPermissionConfig(event.id);
  await ctx.tx.call('users.permissions.addItem', {
    item: event.id,
    type: permissionConfig.type,
    data: permissionConfig.all,
    isCustomPermission: true,
  });
  await addNexts({ eventId: event.id, ctx });
  return { ...event, data: _.isString(event.data) ? JSON.parse(event.data || null) : event.data };
}

module.exports = { add };
