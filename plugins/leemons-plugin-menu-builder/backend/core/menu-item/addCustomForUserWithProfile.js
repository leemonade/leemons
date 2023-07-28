const {
  validateExistMenuItem,
  validateNotExistMenu,
  validateNotExistMenuItem,
} = require('../../validations/exists');

/**
 * Create a Menu Item
 * @private
 * @static
 * @param {string} userId User id
 * @param {string} profileId Profile id
 * @param {MenuItemAdd} data - The Menu Item to create
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function addCustomForUserWithProfile({
  userId,
  profileId,
  label,
  description,
  ctx,
  ...data
}) {
  // eslint-disable-next-line no-param-reassign
  data.key = ctx.prefixPN(`user.${userId}.${profileId.replaceAll('-', '')}.${data.key}`);

  // Check for required params
  await validateNotExistMenu({ key: data.menuKey, ctx });

  // Check if the MENU ITEM exists
  await validateExistMenuItem({ menuKey: data.menuKey, key: data.key, ctx });

  // Check if the MENU ITEM PARENT exists
  await validateNotExistMenuItem({ menuKey: data.menuKey, key: data.parentKey, ctx });

  const user = await ctx.tx.call('users.users.detail', { userId });

  // Create the MENU ITEM
  const promises = [ctx.tx.db.MenuItem.create(data)];

  // Create LABEL & DESCRIPTIONS in locales
  if (label) {
    promises.push(
      ctx.tx.call('multilanguage.contents.add', {
        key: ctx.prefixPN(`${data.menuKey}.${data.key}.label`),
        locale: user.locale,
        value: label,
      })
    );
  }

  if (description) {
    promises.push(
      ctx.tx.call('multilanguage.contents.add', {
        key: ctx.prefixPN(`${data.menuKey}.${data.key}.description`),
        locale: user.locale,
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
    ctx.tx.call('users.permissions.addCustomPermissionToUserProfile', {
      user: userId,
      profile: profileId,
      permissions: [
        {
          permissionName: data.key,
          actionNames: ['admin'],
        },
      ],
    })
  );

  const [menuItem] = await Promise.all(promises);

  ctx.logger.info(`Added custom menu item "${data.key}" to menu "${data.menuKey}"`);

  return menuItem;
}

module.exports = { addCustomForUserWithProfile };
