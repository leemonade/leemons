/**
 * Add locale to platform
 * @public
 * @static
 * @param {string} locale - Locale
 * @param {string} name - Name
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function removeLocale({ locale, ctx }) {
  const exists = await ctx.tx.call('multilanguage.locales.has', {
    code: locale,
  });
  if (exists) {
    await ctx.tx.call('multilanguage.locales.delete', {
      code: locale,
    });
    return true;
  }
  return true;
}

module.exports = removeLocale;
