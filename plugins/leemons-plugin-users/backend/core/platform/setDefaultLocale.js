const { LeemonsError } = require('@leemons/error');

/**
 * Set default locale por platform
 * @public
 * @static
 * @param {string} locale - Locale
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function setDefaultLocale({ value, ctx }) {
  const exists = await ctx.tx.call('multilanguage.locales.has', {
    code: value,
  });
  if (!exists) throw new LeemonsError(ctx, { message: `The locale '${value}' not exists` });
  const response = await ctx.tx.db.Config.findOneAndUpdate(
    { key: 'platform-locale' },
    {
      key: 'platform-locale',
      value,
    },
    {
      new: true,
      lean: true,
      upsert: true,
    }
  );
  await ctx.tx.emit('change-platform-locale', { locale: value });
  return response;
}

module.exports = setDefaultLocale;
