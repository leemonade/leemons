const { table } = require('../../tables');

/**
 * ES
 * Devuelve un menu item con dicha clave
 *
 * EN
 * Return a menu item with this key
 *
 * @public
 * @static
 * @param {string} menuKey - A name to identify the Menu (just to admin it)
 * @param {string} key - A name to identify the Menu item (just to admin it)
 * @param {any=} transacting DB transaction
 * @return {Promise<boolean>}
 * */
async function getByMenuAndKey(menuKey, key, { transacting } = {}) {
  const menuItem = await table.menuItem.findOne({ menuKey, key }, { transacting });
  return menuItem;
}

module.exports = getByMenuAndKey;
