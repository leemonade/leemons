/**
 * ES
 * Comprueba si existe un menu con dicha clave
 *
 * EN
 * Check if there is a menu with this key
 *
 * @public
 * @static
 * @param {string} key - A name to identify the Menu (just to admin it)
 * @param {any=} transacting DB transaction
 * @return {Promise<boolean>}
 * */
async function exist({ key, ctx }) {
  const existMenu = await ctx.tx.db.Menu.countDocuments({ key });
  return !!existMenu;
}

module.exports = exist;
