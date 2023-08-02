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
async function getByMenuAndKey({ menuKey, key, ctx }) {
  const menuItem = await ctx.tx.db.MenuItem.findOne({ menuKey, key }).lean();
  return menuItem;
}

module.exports = { getByMenuAndKey };
