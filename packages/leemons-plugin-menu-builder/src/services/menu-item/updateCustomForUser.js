const _ = require('lodash');
const { table } = require('../../tables');
const { translations } = require('../../translations');
const { validateNotExistMenu, validateNotExistMenuItem } = require('../../validations/exists');

const { withTransaction } = global.utils;

/**
 * Update custom Menu Item
 * @private
 * @static
 * @param {UserSession} userSession User session
 * @param {string} menuKey - The Menu key
 * @param {string} key - The item key
 * @param {object} json - The item data to update
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function updateCustomForUser(
  userSession,
  menuKey,
  key,
  { label, description, ...data },
  { transacting: _transacting } = {}
) {
  const locales = translations();

  if (!key.startsWith(leemons.plugin.prefixPN(`user.${userSession.id}.`))) {
    throw new Error('You can only update your own custom items');
  }

  return withTransaction(
    async (transacting) => {
      // Check for required params
      await validateNotExistMenu(menuKey, { transacting });

      // Check if the MENU ITEM exists
      await validateNotExistMenuItem(menuKey, key, { transacting });

      // Update the MENU ITEM
      const promises = [];

      if (!_.isEmpty(data)) {
        promises.push(table.menuItem.update({ menuKey, key }, data, { transacting }));
      }

      // Update LABEL & DESCRIPTIONS in locales
      if (locales) {
        if (label) {
          promises.push(
            locales.contents.setValue(
              leemons.plugin.prefixPN(`${menuKey}.${key}.label`),
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
            locales.contents.setValue(
              leemons.plugin.prefixPN(`${menuKey}.${key}.description`),
              userSession.locale,
              description,
              {
                transacting,
              }
            )
          );
        }
      }

      await Promise.all(promises);

      leemons.log.info(`Updated custom menu item "${key}" from menu "${menuKey}"`);

      return true;
    },
    table.menuItem,
    _transacting
  );
}

module.exports = updateCustomForUser;
