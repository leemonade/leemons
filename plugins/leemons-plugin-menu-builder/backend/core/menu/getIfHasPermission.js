const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const transformManyMenuItemsToFrontEndMenu = require('../menu-item/transformManyMenuItemsToFrontEndMenu');
const { validateNotExistMenu } = require('../../validations/exists');

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
async function getIfHasPermission({ menuKey, ctx }) {
  await validateNotExistMenu({ key: menuKey, ctx });

  const [isSuperAdmin, userPermissions] = await Promise.all([
    ctx.tx.call('users.users.isSuperAdmin', {
      userId: ctx.meta.userSession.id,
    }),
    ctx.tx.call('users.permissions.getUserAgentPermissions', {
      userAgent: ctx.meta.userSession.userAgents,
    }),
  ]);

  const queryPermissions = [];

  // ES: Preparación de la consulta para comprobar los permisos
  // EN: Preparation of the query to check permissions
  if (userPermissions.length) {
    _.forEach(userPermissions, (userPermission) => {
      queryPermissions.push({
        permissionName: userPermission.permissionName,
        actionName: userPermission.actionNames,
        target: userPermission.target,
      });
    });
  }

  // ES: Si el menú tiene permisos comprobamos si tenemos acceso si no tiene permisos significa que cualquiera tiene acceso.
  // EN: If the menu has permissions we check if we have access if it does not have permissions it means that anyone has access.

  const menuHasPermissions = await ctx.tx.call('users.permissions.countItems', {
    params: {
      type: 'menu',
      item: menuKey,
    },
  });

  if (menuHasPermissions) {
    const menuItemHasPermissions = await ctx.tx.call('users.permissions.countItems', {
      params: {
        $or: queryPermissions,
        type: 'menu',
        item: menuKey,
      },
    });

    if (!menuItemHasPermissions)
      throw new LeemonsError(ctx, { message: `You do not have access to the '${menuKey}' menu` });
  }

  // ES: Cogemos solo los elementos del menu a los que tenemos acceso
  // EN: We take only the menu items to which we have access.
  const query = {
    type: { $regex: `^${ctx.prefixPN(`${menuKey}.menu-item`)}` },
  };
  query.$or = queryPermissions;
  const menuItemPermissions = await ctx.tx.call('users.permissions.findItems', { params: query });

  // EN: Get menu items
  let menuItems = await ctx.tx.db.MenuItem.find({
    menuKey,
    key: _.uniq(_.map(menuItemPermissions, 'item')),
  }).lean();

  const customItemIds = _.map(
    _.filter(menuItemPermissions, ({ type }) => type.endsWith('.custom')),
    'item'
  );

  if (isSuperAdmin) {
    menuItems = menuItems.filter((item) => item.key.indexOf('admin') === 0);
  }

  return transformManyMenuItemsToFrontEndMenu({
    menuItems,
    locale: ctx.meta.userSession.locale,
    customItemIds,
    ctx,
  });
}

module.exports = getIfHasPermission;
