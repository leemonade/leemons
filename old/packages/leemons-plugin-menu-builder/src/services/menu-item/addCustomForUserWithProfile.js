const _ = require('lodash');
const { table } = require('../../tables');
const { translations } = require('../../translations');
const {
  validateExistMenuItem,
  validateNotExistMenu,
  validateNotExistMenuItem,
} = require('../../validations/exists');

const { withTransaction } = global.utils;

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
async function addCustomForUserWithProfile(
  userId,
  profileId,
  { label, description, ...data },
  { transacting: _transacting } = {}
) {
  const locales = translations();
  const permissionsService = leemons.getPlugin('users').services.permissions;
  const userService = leemons.getPlugin('users').services.users;

  // eslint-disable-next-line no-param-reassign
  data.key = leemons.plugin.prefixPN(`user.${userId}.${profileId.replaceAll('-', '')}.${data.key}`);

  return withTransaction(
    async (transacting) => {
      // Check for required params
      await validateNotExistMenu(data.menuKey, { transacting });

      // Check if the MENU ITEM exists
      await validateExistMenuItem(data.menuKey, data.key, { transacting });

      // Check if the MENU ITEM PARENT exists
      await validateNotExistMenuItem(data.menuKey, data.parentKey, { transacting });

      const user = await userService.detail(userId, { transacting });

      // Create the MENU ITEM
      const promises = [table.menuItem.create(data, { transacting })];

      // Create LABEL & DESCRIPTIONS in locales
      if (locales) {
        if (label) {
          promises.push(
            locales.contents.add(
              leemons.plugin.prefixPN(`${data.menuKey}.${data.key}.label`),
              user.locale,
              label,
              {
                transacting,
              }
            )
          );
        }

        if (description) {
          promises.push(
            locales.contents.add(
              leemons.plugin.prefixPN(`${data.menuKey}.${data.key}.description`),
              user.locale,
              description,
              {
                transacting,
              }
            )
          );
        }
      }

      // Add the necessary permissions to view the item
      promises.push(
        permissionsService.addItem(
          data.key,
          leemons.plugin.prefixPN(`${data.menuKey}.menu-item.custom`),
          {
            permissionName: data.key,
            actionNames: ['view', 'admin'],
          },
          { isCustomPermission: true, transacting }
        )
      );

      promises.push(
        await permissionsService.addCustomPermissionToUserProfile(
          userId,
          profileId,
          [
            {
              permissionName: data.key,
              actionNames: ['admin'],
            },
          ],
          { transacting }
        )
      );

      const [menuItem] = await Promise.all(promises);

      leemons.log.info(`Added custom menu item "${data.key}" to menu "${data.menuKey}"`);

      return menuItem;
    },
    table.menuItem,
    _transacting
  );
}

module.exports = { addCustomForUserWithProfile };
