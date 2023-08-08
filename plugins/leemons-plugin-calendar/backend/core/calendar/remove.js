const _ = require('lodash');
const { validateNotExistCalendar } = require('../../validations/exists');
const { remove: removeEvent } = require('../events/remove');
const { getPermissionConfig } = require('./getPermissionConfig');
const { getEvents } = require('./getEvents');

/**
 * Remove calendar if exists
 * @public
 * @static
 * @param {string} id - id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function remove({ id, ctx }) {
  await validateNotExistCalendar({ id, ctx });

  // -- Calendar events
  const events = await getEvents({ calendar: id, ctx });
  await Promise.all(_.map(events, (event) => removeEvent({ id: event.id, ctx })));

  // -- Calendar
  const calendar = await ctx.tx.db.Calendars.findOne({ id }).select(['id', 'key']).lean();
  const permissionConfig = getPermissionConfig(calendar.key);

  await Promise.all([
    // ES: Borramos a todos los agentes el permiso del calendario ya que este dejara de existir
    await ctx.tx.call('users.permissions.removeCustomPermissionForAllUserAgents', {
      data: { permissionName: permissionConfig.permissionName },
    }),
    // ES: Borramos el elemento de la tabla items de permisos ya que dejara de existir
    await ctx.tx.call('users.permissions.removeItems', {
      query: {
        type: permissionConfig.type,
        item: id,
      },
    }),
  ]);

  await ctx.tx.db.ClassCalendar.deleteMany({ calendar: id });
  await ctx.tx.db.Calendars.deleteOne({ id });

  return true;
}

module.exports = { remove };
