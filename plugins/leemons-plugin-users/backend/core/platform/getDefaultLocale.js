/**
 * Return default locale por platform
 * @public
 * @static
 * @param {any} transacting - DB Transaction
 * @return {Promise<string | null>} locale
 * */
async function getDefaultLocale({ ctx }) {
  const config = await ctx.tx.db.Config.findOne({ key: 'platform-locale' }).lean();
  return config ? config.value : null;
}

module.exports = getDefaultLocale;
