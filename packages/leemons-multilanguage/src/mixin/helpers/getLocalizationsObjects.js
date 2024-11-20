const { flatten } = require('lodash');
const path = require('path');

/**
 * Loads localization files for the specified locales from the given path.
 * Attempts to load both .js and .json files for each locale.
 * Logs an error if neither file type can be loaded for a locale.
 *
 * @param {Object} params - The parameters for loading localizations.
 * @param {string[]} params.locales - An array of locale strings to load localizations for.
 * @param {import('fs').PathLike} params.i18nPath - The path to the directory containing localization files.
 * @param {Object} params.logger - The logger to use for logging errors.
 * @returns {Object} An object mapping each locale to its loaded localizations.
 */
function getLocalizationsObjects({ locales: _locales, i18nPath, logger }) {
  const locales = flatten(_locales);

  const localizations = {};

  locales.forEach((locale) => {
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const importedFile = require(path.resolve(i18nPath, `${locale}.js`));

      localizations[locale] = importedFile.__esModule ? importedFile.default : importedFile;
    } catch (e) {
      try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        localizations[locale] = require(path.resolve(i18nPath, `${locale}.json`));
      } catch (_) {
        logger.error(
          `Unable to load locale: ${i18nPath}/${locale}.js and ${i18nPath}/${locale}.json are missing`
        );
      }
    }
  });

  return localizations;
}

module.exports = { getLocalizationsObjects };
