const { translations } = require('../translations');

/**
 * Return all platform locales
 * @public
 * @static
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getLocales({ transacting } = {}) {
  const translations = translations();
  return translations.locales.getAll({ transacting });
}

module.exports = getLocales;
