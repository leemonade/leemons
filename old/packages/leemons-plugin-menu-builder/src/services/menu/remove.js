const _ = require('lodash');
const removeAll = require('../menu-item/removeAll');
const { validateNotExistMenu } = require('../../validations/exists');
const { validateKeyPrefix } = require('../../validations/exists');
const { table } = require('../../tables');

const { withTransaction } = global.utils;

/**
 * Create a Menu
 * @public
 * @static
 * @param {string} key - A name to identify the Menu (just to admin it)
 * @param {any=} transacting DB Trasaction
 * @return {Promise<Menu>} Created / Updated menu
 * */
async function remove(key, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);
  return withTransaction(
    async (transacting) => {
      await validateNotExistMenu(key, { transacting });

      await Promise.all([
        table.menu.delete({ key }, { transacting }),
        leemons.getPlugin('users').services.permissions.removeItems(
          {
            type: leemons.plugin.prefixPN('menu'),
            item: key,
          },
          { transacting }
        ),
        removeAll.call(this, key, { transacting }),
      ]);

      leemons.log.info(`Deleted menu "${key}"`);

      return true;
    },
    table.menu,
    _transacting
  );
}

module.exports = remove;
