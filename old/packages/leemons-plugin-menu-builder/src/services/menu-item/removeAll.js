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
 * @param {any=} transacting DB transaction
 * @return {Promise<boolean>}
 * */
async function removeAll(menuKey, { transacting: _transacting } = {}) {
  validateKeyPrefix(menuKey, this.calledFrom);

  const locales = translations();

  return withTransaction(
    async (transacting) => {
      const promises = [
        // Delete item
        table.menuItem.deleteMany({ menuKey }, { transacting }),
        // Delete permissions of all items
        leemons.getPlugin('users').services.permissions.removeItems(
          {
            type_$startsWith: leemons.plugin.prefixPN(menuKey),
          },
          { transacting }
        ),
      ];

      // Delete translations of all items
      if (locales) {
        promises.push(
          locales.contents.deleteKeyStartsWith(leemons.plugin.prefixPN(`${menuKey}`), {
            transacting,
          })
        );
      }

      await Promise.all(promises);

      leemons.log.info(`Deleted all menu items of menu "${menuKey}"`);

      return true;
    },
    table.menuItem,
    _transacting
  );
}

module.exports = removeAll;
