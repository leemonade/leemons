const _ = require('lodash');
const { validateKeyPrefix } = require('../../validations/exists');
const { table } = require('../../tables');
const { validateExistMenu } = require('../../validations/exists');

const { withTransaction } = global.utils;

/**
 * Create a Menu
 * @public
 * @static
 * @param {string} key - A name to identify the Menu (just to admin it)
 * @param {MenuPermissionsAdd} permissions Permissions for Menu
 * @param {any=} transacting DB Trasaction
 * @return {Promise<Menu>} Created / Updated menu
 * */
async function add(key, permissions, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);
  return withTransaction(
    async (transacting) => {
      await validateExistMenu(key, { transacting });

      const menu = await table.menu.create({ key }, { transacting });

      // Add the necessary permissions to view the item
      if (_.isArray(permissions) && permissions.length) {
        await leemons
          .getPlugin('users')
          .services.permissions.addItem(key, leemons.plugin.prefixPN('menu'), permissions, {
            transacting,
          });
      }

      leemons.log.info(`Added menu "${key}"`);

      return menu;
    },
    table.menu,
    _transacting
  );
}

module.exports = add;
