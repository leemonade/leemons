const { translations } = require('../translations');
const { table } = require('../tables');

/**
 * Set default locale por platform
 * @public
 * @static
 * @param {string} locale - Locale
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function setLocale(locale, { transacting } = {}) {
  if (!(await translations().locales.has(locale)))
    throw new Error(`The locale '${locale}' not exists`);
  return await table.config.set(
    { key: 'platform-locale' },
    {
      key: 'platform-locale',
      value: locale,
    },
    { transacting }
  );
}

module.exports = setLocale;
