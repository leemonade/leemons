/**
 * Add locale to platform
 * @public
 * @static
 * @param {string} locale - Locale
 * @param {string} name - Name
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function addLocale({ locale, name, ctx }) {
  const exists = await ctx.tx.call('multilanguage.locales.has', {
    code: locale,
  });
  if (exists) {
    return ctx.tx.call('multilanguage.locales.get', {
      code: locale,
    });
  }
  return ctx.tx.call('multilanguage.locales.add', {
    code: locale,
    name,
  });
}

module.exports = addLocale;
