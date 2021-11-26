const _ = require('lodash');
const { table } = require('../tables');
const {
  getPermissionConfig: getPermissionConfigCalendar,
} = require('../calendar/getPermissionConfig');
const {
  getPermissionConfig: getPermissionConfigEvent,
  getPermissionConfig,
} = require('./getPermissionConfig');
const { detail: detailEvent } = require('./detail');
const { detail: detailCalendar } = require('../calendar/detail');
const { removeOrCancel } = require('./removeOrCancel');
const { unGrantAccessUserAgentToEvent } = require('./unGrantAccessUserAgentToEvent');

/**
 *
 * @public
 * @static
 * @param {string} id - id
 * @param {any=} _transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function remove(id, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const permissionConfig = getPermissionConfig(id);
      const permissionQuery = {
        permissionName: permissionConfig.permissionName,
      };
      const userPlugin = leemons.getPlugin('users');

      await Promise.all([
        // ES: Borramos a todos los agentes el permiso del evento ya que este dejara de existir
        await userPlugin.services.permissions.removeCustomPermissionForAllUserAgents(
          permissionQuery,
          {
            transacting,
          }
        ),
        // ES: Borramos el elemento de la tabla items de permisos ya que dejara de existir
        await userPlugin.permissions.removeItems(
          {
            type: permissionConfig.type,
            item: id,
          },
          {
            transacting,
          }
        ),
      ]);

      return table.events.delete({ id }, { transacting });
    },
    table.events,
    _transacting
  );
}

module.exports = { remove };
