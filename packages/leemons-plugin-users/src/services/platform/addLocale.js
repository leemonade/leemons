const { translations } = require('../translations');

/**
 * Add locale to platform
 * @public
 * @static
 * @param {string} locale - Locale
 * @param {string} name - Name
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function addLocale(locale, name, { transacting } = {}) {
  const trans = translations();

  if (await trans.locales.has(locale, { transacting })) {
    return trans.locales.get(locale, { transacting });
  }
  // console.log('añadimos el locale', locale);
  return trans.locales.add(locale, name, { transacting });
}

module.exports = addLocale;
