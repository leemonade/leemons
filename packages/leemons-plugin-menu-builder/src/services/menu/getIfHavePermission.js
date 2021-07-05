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
 * @param {UserAuth} userAuth - User auth
 * @param {any=} transacting DB transaction
 * @return {Promise<any>}
 * */
async function getIfHavePermission(menuKey, userAuth, { transacting } = {}) {
  await validateNotExistMenu(menuKey, { transacting });

  let userPermissions = [];
  const isSuperAdmin = await leemons.plugins.users.services.users.isSuperAdmin(userAuth.user, {
    transacting,
  });
  if (!isSuperAdmin)
    userPermissions = await leemons.plugins.users.services.users.getUserPermissions(userAuth, {
      transacting,
    });

  const queryPermissions = [];

  // ES: Preparación de la consulta para comprobar los permisos
  // EN: Preparation of the query to check permissions
  if (userPermissions.length) {
    _.forEach(userPermissions, (userPermission) => {
      queryPermissions.push({
        permissionName: userPermission.permissionName,
        actionNames: userPermission.actionName,
        target: userPermission.target,
      });
    });
  }

  // ES: Si el menú tiene permisos comprobamos si tenemos acceso si no tiene permisos significa que cualquiera tiene acceso.
  // EN: If the menu has permissions we check if we have access if it does not have permissions it means that anyone has access.
  if (!isSuperAdmin) {
    const menuHasPermissions = await leemons.plugins.users.services.itemPermissions.count(
      {
        type: 'menu',
        item: menuKey,
      },
      { transacting }
    );

    if (menuHasPermissions) {
      const menuItemHasPermissions = await leemons.plugins.users.services.itemPermissions.count(
        {
          $or: queryPermissions,
          type: 'menu',
          item: menuKey,
        },
        { transacting }
      );

      if (!menuItemHasPermissions)
        throw new Error(`You do not have access to the '${menuKey}' menu`);
    }
  }

  // ES: Cogemos solo los elementos del menu a los que tenemos acceso
  // EN: We take only the menu items to which we have access.
  const query = {
    type: `${menuKey}.menu-item`,
  };
  if (!isSuperAdmin) query.$or = queryPermissions;
  const menuItemPermissions = await leemons.plugins.users.services.itemPermissions.find(query, {
    transacting,
  });

  // EN: Get menu items
  const menuItems = await table.menuItem.find(
    {
      menuKey,
      key_$in: _.uniq(_.map(menuItemPermissions, 'item')),
    },
    { transacting }
  );

  // TODO Añadir locale del user para sacar el menu en su idioma
  const locale = 'en';

  return transformManyMenuItemsToFrontEndMenu(menuItems, locale, { transacting });
}

module.exports = getIfHavePermission;
