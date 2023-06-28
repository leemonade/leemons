/**
 * Return default email por platform
 * @public
 * @static
 * @param {any} transacting - DB Transaction
 * @return {Promise<string | null>} locale
 * */
async function getEmail({ ctx }) {
  const config = await ctx.tx.db.Config.findOne({ key: 'platform-email' }).lean();
  return config ? config.value : null;
}

module.exports = getEmail;
