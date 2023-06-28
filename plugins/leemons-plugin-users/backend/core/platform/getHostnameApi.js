/**
 * Return default hostname por platform
 * @public
 * @static
 * @param {any} transacting - DB Transaction
 * @return {Promise<string | null>} locale
 * */
async function getHostnameApi({ ctx }) {
  const config = await ctx.tx.db.Config.findOne({ key: 'platform-hostname-api' }).lean();
  return config ? config.value : null;
}

module.exports = getHostnameApi;
