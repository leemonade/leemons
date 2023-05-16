const _ = require('lodash');
const transformManyMenuItemsToFrontEndMenu = require('../menu-item/transformManyMenuItemsToFrontEndMenu');
const { validateNotExistMenu } = require('../../validations/exists');
const { table } = require('../../tables');

/**
 * ES
 * Devuelve el menu con todos los items y todas las traducciones sacandolos solo si el usuario tiene permiso
 *
 * EN
 * Returns the menu with all items and all translations only if the user has permission.
 *
 * @public
 * @static
 * @param {string} menuKey - A name to identify the Menu (just to admin it)
 * @param {UserSession} userSession - User auth
 * @param {any=} transacting DB transaction
 * @return {Promise<any>}
 * */
async function getIfHasPermission(menuKey, userSession, { transacting } = {}) {
  await validateNotExistMenu(menuKey, { transacting });

  let userPermissions = [];
  const isSuperAdmin = await leemons
    .getPlugin('users')
    .services.users.isSuperAdmin(userSession.id, {
      transacting,
    });

  userPermissions = await leemons
    .getPlugin('users')
    .services.permissions.getUserAgentPermissions(userSession.userAgents, {
      transacting,
    });

  const queryPermissions = [];

  // ES: Preparación de la consulta para comprobar los permisos
  // EN: Preparation of the query to check permissions
  if (userPermissions.length) {
    _.forEach(userPermissions, (userPermission) => {
      queryPermissions.push({
        permissionName: userPermission.permissionName,
        actionName_$in: userPermission.actionNames,
        target: userPermission.target,
      });
    });
  }

  // ES: Si el menú tiene permisos comprobamos si tenemos acceso si no tiene permisos significa que cualquiera tiene acceso.
  // EN: If the menu has permissions we check if we have access if it does not have permissions it means that anyone has access.

  const menuHasPermissions = await leemons.getPlugin('users').services.permissions.countItems(
    {
      type: 'menu',
      item: menuKey,
    },
    { transacting }
  );

  if (menuHasPermissions) {
    const menuItemHasPermissions = await leemons.getPlugin('users').services.permissions.countItems(
      {
        $or: queryPermissions,
        type: 'menu',
        item: menuKey,
      },
      { transacting }
    );

    if (!menuItemHasPermissions) throw new Error(`You do not have access to the '${menuKey}' menu`);
  }

  // ES: Cogemos solo los elementos del menu a los que tenemos acceso
  // EN: We take only the menu items to which we have access.
  const query = {
    type_$startssWith: leemons.plugin.prefixPN(`${menuKey}.menu-item`),
  };
  query.$or = queryPermissions;
  const menuItemPermissions = await leemons
    .getPlugin('users')
    .services.permissions.findItems(query, {
      transacting,
    });

  // EN: Get menu items
  let menuItems = await table.menuItem.find(
    {
      menuKey,
      key_$in: _.uniq(_.map(menuItemPermissions, 'item')),
    },
    { transacting }
  );

  const customItemIds = _.map(
    _.filter(menuItemPermissions, ({ type }) => type.endsWith('.custom')),
    'item'
  );

  if (isSuperAdmin) {
    menuItems = menuItems.filter((item) => item.key.indexOf('plugins.admin') === 0);
  }

  return transformManyMenuItemsToFrontEndMenu(menuItems, userSession.locale, customItemIds, {
    transacting,
  });
}

module.exports = getIfHasPermission;
