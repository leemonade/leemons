const _ = require('lodash');
const { table } = require('../../tables');
const { translations } = require('../../translations');
const { validateNotExistMenu, validateNotExistMenuItem } = require('../../validations/exists');

const { withTransaction } = global.utils;

/**
 * Remove custom Menu Item
 * @private
 * @static
 * @param {UserSession} userSession User session
 * @param {string} menuKey - The Menu key
 * @param {string} key - The item key
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function removeCustomForUser(userSession, menuKey, key, { transacting: _transacting } = {}) {
  const locales = translations();

  if (!key.startsWith(leemons.plugin.prefixPN(`user.${userSession.id}.`))) {
    throw new Error('You can only delete your own custom items');
  }

  return withTransaction(
    async (transacting) => {
      // Check for required params
      await validateNotExistMenu(menuKey, { transacting });

      // Check if the MENU ITEM exists
      await validateNotExistMenuItem(menuKey, key, { transacting });

      // Remove the MENU ITEM
      const promises = [table.menuItem.delete({ menuKey, key }, { transacting })];

      // Remove LABEL & DESCRIPTIONS in locales
      if (locales) {
        promises.push(
          locales.contents.deleteKeyStartsWith(leemons.plugin.prefixPN(`${menuKey}.${key}`), {
            transacting,
          })
        );
      }

      // Remove permissions for item
      promises.push(
        leemons.getPlugin('users').services.permissions.removeItems(
          {
            type: leemons.plugin.prefixPN(`${menuKey}.menu-item.custom`),
            item: key,
          },
          { transacting }
        )
      );

      // Remove de custom permission
      promises.push(
        leemons.getPlugin('users').services.users.removeCustomUserAgentPermission(
          _.map(userSession.userAgents, 'id'),
          {
            permissionName: key,
          },
          { transacting }
        )
      );

      await Promise.all(promises);

      leemons.log.info(`Remove custom menu item "${key}" from menu "${menuKey}"`);

      return true;
    },
    table.menuItem,
    _transacting
  );
}

module.exports = removeCustomForUser;
