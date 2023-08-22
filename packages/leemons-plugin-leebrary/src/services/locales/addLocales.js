const path = require('path');
const { flattenDeep } = require('lodash');
const { translations } = require('../../translations');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Load locale data from file.
 * @param {string} locale - The locale to load.
 * @returns {Object} The loaded locale data.
 */
function loadLocaleData(locale) {
  const localePath = path.resolve(__dirname, `../../i18n/${locale}.js`);
  try {
    // eslint-disable-next-line import/no-dynamic-require
    return require(localePath);
  } catch (err) {
    leemons.log.error(`Unable to load locale: ${localePath}`);
    return null;
  }
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Add locales to the language service.
 * @param {Array<string>} langs - The locales to add.
 * @returns {Promise<void>} A promise that resolves when the locales have been added.
 */
async function addLocales(langs) {
  const locales = flattenDeep([langs]);
  const languageService = translations();

  if (languageService) {
    const localesData = locales.reduce((acc, locale) => {
      const localeData = loadLocaleData(locale);
      if (localeData) {
        acc[locale] = localeData;
      }
      return acc;
    }, {});

    await languageService.common.setManyByJSON(localesData, leemons.plugin.prefixPN(''));
  }
}

module.exports = { addLocales };
