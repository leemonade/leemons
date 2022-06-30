const _ = require('lodash');
const { table } = require('../../tables');
const { translations } = require('../../translations');
const { validateNotExistMenuItem } = require('../../validations/exists');
const { validateKeyPrefix } = require('../../validations/exists');

const { withTransaction } = global.utils;

/**
 * Remove a menu item
 * @private
 * @static
 * @param {string} menuKey - The Menu Item key
 * @param {string} key - The Menu Item key
 * @param {any=} transacting DB transaction
 * @return {Promise<boolean>}
 * */
async function remove(menuKey, key, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);

  const locales = translations();

  return withTransaction(
    async (transacting) => {
      // Check if the MENU ITEM not exists
      await validateNotExistMenuItem(menuKey, key, { transacting });

      const promises = [
        // Delete item
        table.menuItem.delete({ key }, { transacting }),
        // Delete item permissions
        leemons.getPlugin('users').services.permissions.removeItems(
          {
            type: leemons.plugin.prefixPN(`${menuKey}.menu-item`),
            item: key,
          },
          { transacting }
        ),
      ];

      // Delete item translations
      if (locales) {
        promises.push(
          locales.contents.deleteKeyStartsWith(leemons.plugin.prefixPN(`${menuKey}.${key}.`), {
            transacting,
          })
        );
      }

      await Promise.all(promises);

      leemons.log.info(`Deleted menu item "${key}" of menu "${menuKey}"`);

      return true;
    },
    table.menuItem,
    _transacting
  );
}

module.exports = remove;
