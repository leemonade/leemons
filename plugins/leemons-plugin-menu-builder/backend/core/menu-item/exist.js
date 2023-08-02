/**
 * ES
 * Comprueba si existe un menu item con dicha clave
 *
 * EN
 * Check if there is a menu item with this key
 *
 * @public
 * @static
 * @param {string} menuKey - A name to identify the Menu (just to admin it)
 * @param {string} key - A name to identify the Menu item (just to admin it)
 * @param {any=} transacting DB transaction
 * @return {Promise<boolean>}
 * */
async function exist({ menuKey, key, ctx }) {
  const existMenu = await ctx.tx.db.MenuItem.countDocuments({ menuKey, key });
  return !!existMenu;
}

module.exports = { exist };
