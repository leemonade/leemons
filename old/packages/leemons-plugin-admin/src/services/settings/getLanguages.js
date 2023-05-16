/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function getLanguages() {
  const { services: userService } = leemons.getPlugin('users');
  const locales = await userService.platform.getLocales();
  const defaultLocale = await userService.platform.getDefaultLocale();

  return { locales, defaultLocale };
}

module.exports = getLanguages;
