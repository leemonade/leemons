const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');

const { validateNotExistMenu } = require('../../validations/exists');
const {
  transformManyMenuItemsToFrontEndMenu,
} = require('../menu-item/transformManyMenuItemsToFrontEndMenu');

/**
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

  const [profileSysName, userPermissions, deploymentConfig] = await Promise.all([
    ctx.tx.call('users.profiles.getProfileSysName'),
    ctx.tx.call('users.permissions.getUserAgentPermissions', {
      userAgent: ctx.meta.userSession.userAgents,
    }),
    ctx.tx.call('deployment-manager.getConfigRest', { allConfig: true }),
  ]);

  const queryPermissions = [];

  // Preparation of the query to check permissions
  if (userPermissions.length) {
    _.forEach(userPermissions, (userPermission) => {
      queryPermissions.push({
        permissionName: userPermission.permissionName,
        actionName: userPermission.actionNames,
        target: userPermission.target,
      });
    });
  }

  // If the menu has permissions we check if we have access if it does not have permissions it means that anyone has access.
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

  // We take only the menu items to which we have access.
  const typeTemplate = _.escapeRegExp(ctx.prefixPN(`${menuKey}.menu-item`));
  const query = {
    type: { $regex: `^${typeTemplate}` },
  };
  query.$or = queryPermissions;
  const menuItemPermissions = await ctx.tx.call('users.permissions.findItems', { params: query });

  // EN: Get menu items
  let menuItems = await ctx.tx.db.MenuItem.find({
    menuKey,
    key: _.uniq(_.map(menuItemPermissions, 'item')),
  }).lean();

  // Get the menus that are disabled in the deployment configuration
  const disabledMenus = [];
  Object.keys(deploymentConfig).forEach((pluginName) => {
    const menu = deploymentConfig[pluginName]?.deny?.menu;
    if (menu) {
      // Add all the menu keys from the plugin (ignoring the version) to the disabledMenus array
      disabledMenus.push(...menu.map((item) => `${pluginName}.${item}`.replace(/^v\d+\./g, '')));
    }
  });

  menuItems = menuItems.filter((item) => !disabledMenus.includes(item.key));

  const customItemIds = _.map(
    _.filter(menuItemPermissions, ({ type }) => type.endsWith('.custom')),
    'item'
  );

  // Skip main menu for super users
  if (profileSysName === 'super' && menuKey.indexOf('leebrary') < 0) {
    menuItems = menuItems.filter((item) => item.key.indexOf('admin') === 0);
  }

  return transformManyMenuItemsToFrontEndMenu({
    menuItems,
    locale: ctx.meta.userSession.locale,
    customItemIds,
    ctx,
  });
}

module.exports = { getIfHasPermission };
