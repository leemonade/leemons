const _ = require('lodash');
const { table } = require('../tables');
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
async function remove(id, { _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistCalendar(id, { transacting });

      const userPlugin = leemons.getPlugin('users');

      // -- Calendar events
      const events = await getEvents(id, { transacting });
      await Promise.all(_.map(events, (event) => removeEvent(event.id, { transacting })));

      // -- Calendar
      const calendar = await table.calendars.findOne(
        { id },
        { columns: ['id', 'key'], transacting }
      );
      const permissionConfig = getPermissionConfig(calendar.key);

      await Promise.all([
        // ES: Borramos a todos los agentes el permiso del calendario ya que este dejara de existir
        await userPlugin.services.permissions.removeCustomPermissionForAllUserAgents(
          { permissionName: permissionConfig.permissionName },
          {
            transacting,
          }
        ),
        // ES: Borramos el elemento de la tabla items de permisos ya que dejara de existir
        await userPlugin.services.permissions.removeItems(
          {
            type: permissionConfig.type,
            item: id,
          },
          {
            transacting,
          }
        ),
      ]);

      await table.classCalendar.deleteMany({ calendar: id }, { transacting });
      await table.calendars.delete({ id }, { transacting });

      return true;
    },
    table.calendars,
    _transacting
  );
}

module.exports = { remove };
