const _ = require('lodash');
const { table } = require('../../tables');
const { translations } = require('../../translations');
const prefixPN = require('../../helpers/prefixPN');
const { validateNotExistMenu, validateNotExistMenuItem } = require('../../validations/exists');

const { withTransaction } = global.utils;

/**
 * Update custom Menu Item
 * @private
 * @static
 * @param {any} userAuth User auth
 * @param {string} menuKey - The Menu key
 * @param {string} key - The item key
 * @param {object} json - The item data to update
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function updateCustomForUser(
  userAuth,
  menuKey,
  key,
  { label, description, ...data },
  { transacting: _transacting } = {}
) {
  const locales = translations();

  if (!key.startsWith(prefixPN(`user:${userAuth.id}.`))) {
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
              prefixPN(`${menuKey}.${key}.label`),
              userAuth.language,
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
              prefixPN(`${menuKey}.${key}.description`),
              userAuth.language,
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
