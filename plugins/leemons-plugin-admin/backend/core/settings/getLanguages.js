/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function getLanguages({ ctx }) {
  const locales = await ctx.tx.call('users.platform.getLocales');
  const defaultLocale = await ctx.tx.call('users.platform.getDefaultLocale');

  return { locales, defaultLocale };
}

module.exports = getLanguages;
