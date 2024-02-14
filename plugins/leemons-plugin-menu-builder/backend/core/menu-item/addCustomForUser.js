const _ = require('lodash');
const {
  validateExistMenuItem,
  validateNotExistMenu,
  validateNotExistMenuItem,
} = require('../../validations/exists');

// menu-builder.menu-builder.main.menu-builder.user:a3578518-b547-4059-8afb-3d715a623b6d.user-list-22.8jrwn3fd8me1ulvna75wgjws2xj0c9a6n.label

/**
 * Create a Menu Item
 * @private
 * @static
 * @param {UserSession} userSession User session
 * @param {MenuItemAdd} data - The Menu Item to create
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function addCustomForUser({ label, description, ctx, ...data }) {
  const profileId = await ctx.tx.call('users.roles.getRoleProfile', {
    roleId: ctx.meta.userSession.userAgents[0].role,
  });

  // eslint-disable-next-line no-param-reassign
  data.key = ctx.prefixPN(
    `user.${ctx.meta.userSession.id}.${profileId.replaceAll('-', '')}.${data.key}`
  );

  // Check for required params
  await validateNotExistMenu({ key: data.menuKey, ctx });

  // Check if the MENU ITEM exists
  await validateExistMenuItem({ menuKey: data.menuKey, key: data.key, ctx });

  // Check if the MENU ITEM PARENT exists
  await validateNotExistMenuItem({ menuKey: data.menuKey, key: data.parentKey, ctx });

  // Create the MENU ITEM
  const promises = [ctx.tx.db.MenuItem.create(data).then((mongooseDoc) => mongooseDoc.toObject())];

  // Create LABEL & DESCRIPTIONS in locales
  if (label) {
    promises.push(
      ctx.tx.call('multilanguage.contents.add', {
        key: ctx.prefixPN(`${data.menuKey}.${data.key}.label`),
        locale: ctx.meta.userSession.locale,
        value: label,
      })
    );
  }

  if (description) {
    promises.push(
      ctx.tx.call('multilanguage.contents.add', {
        key: ctx.prefixPN(`${data.menuKey}.${data.key}.description`),
        locale: ctx.meta.userSession.locale,
        value: description,
      })
    );
  }

  // Add the necessary permissions to view the item
  promises.push(
    ctx.tx.call('users.permissions.addItem', {
      item: data.key,
      type: ctx.prefixPN(`${data.menuKey}.menu-item.custom`),
      data: {
        permissionName: data.key,
        actionNames: ['view', 'admin'],
      },
      isCustomPermission: true,
    })
  );

  promises.push(
    ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
      userAgentId: _.map(ctx.meta.userSession.userAgents, 'id'),
      data: {
        permissionName: data.key,
        actionNames: ['admin'],
      },
    })
  );

  const [menuItem] = await Promise.all(promises);

  ctx.logger.debug(`Added custom menu item "${data.key}" to menu "${data.menuKey}"`);

  return menuItem;
}

module.exports = { addCustomForUser };
