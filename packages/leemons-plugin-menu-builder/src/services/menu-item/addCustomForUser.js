const _ = require('lodash');
const { table } = require('../../tables');
const { translations } = require('../../translations');
const {
  validateExistMenuItem,
  validateNotExistMenu,
  validateNotExistMenuItem,
} = require('../../validations/exists');

const { withTransaction } = global.utils;

// plugins.menu-builder.plugins.menu-builder.main.plugins.menu-builder.user:a3578518-b547-4059-8afb-3d715a623b6d.user-list-22.8jrwn3fd8me1ulvna75wgjws2xj0c9a6n.label

/**
 * Create a Menu Item
 * @private
 * @static
 * @param {UserSession} userSession User session
 * @param {MenuItemAdd} data - The Menu Item to create
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function addCustomForUser(
  userSession,
  { label, description, ...data },
  { transacting: _transacting } = {}
) {
  const locales = translations();

  const profileId = await leemons
    .getPlugin('users')
    .services.roles.getRoleProfile(userSession.userAgents[0].role);

  // eslint-disable-next-line no-param-reassign
  data.key = leemons.plugin.prefixPN(
    `user.${userSession.id}.${profileId.replaceAll('-', '')}.${data.key}`
  );

  return withTransaction(
    async (transacting) => {
      // Check for required params
      await validateNotExistMenu(data.menuKey, { transacting });

      // Check if the MENU ITEM exists
      await validateExistMenuItem(data.menuKey, data.key, { transacting });

      // Check if the MENU ITEM PARENT exists
      await validateNotExistMenuItem(data.menuKey, data.parentKey, { transacting });

      // Create the MENU ITEM
      const promises = [table.menuItem.create(data, { transacting })];

      // Create LABEL & DESCRIPTIONS in locales
      if (locales) {
        if (label) {
          promises.push(
            locales.contents.add(
              leemons.plugin.prefixPN(`${data.menuKey}.${data.key}.label`),
              userSession.locale,
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
              userSession.locale,
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
        leemons.getPlugin('users').services.permissions.addItem(
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
        leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
          _.map(userSession.userAgents, 'id'),
          {
            permissionName: data.key,
            actionNames: ['admin'],
          },
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

module.exports = addCustomForUser;
