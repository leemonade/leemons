const _ = require('lodash');
const validateKey = require('../../../validations/key');
const validateLocale = require('../../../validations/locale');
const throwInvalid = require('../../../validations/throwInvalid');

const localizationsTable = leemons.query('plugins_multilanguage::localizations');

/**
 * Checks if the given localization tuple exists
 * @param {string} key The localization key
 * @param {string} locale The desired locale
 * @returns {Promise<Boolean>} if the locale exists
 */
async function has(key, locale) {
  const _key = key.toLowerCase();
  const _locale = locale.toLowerCase();

  throwInvalid(validateKey(_key));
  throwInvalid(validateLocale(_locale));

  try {
    return (await localizationsTable.count({ key: _key, locale: _locale })) === 1;
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while checking if the localization exists');
  }
}

/**
 * Checks if the given locales exists
 * @param {string[][]} locales The locale iso code xx-YY or xx
 * @returns {Promise<object>} An array with the locales that exists
 */
async function hasMany(locales) {
  // Todo: Add validation (fails when codes is not an array)
  const _localizations = locales.map(([key, locale]) => ({ key, locale: locale.toLowerCase() }));
  throwInvalid(_localizations.map(({ key, locale }) => [validateKey(key), validateLocale(locale)]));

  try {
    const existingLocalizations = await localizationsTable.find(
      { $or: _localizations },
      { columns: ['key', 'locale'] }
    );

    const result = {};

    _localizations.forEach((localization) => {
      // Find if the given tuple exists in the database
      const exists =
        existingLocalizations.findIndex(
          (existingLocalization) =>
            existingLocalization.key === localization.key &&
            existingLocalization.locale === localization.locale
        ) !== -1;

      if (!_.has(result, localization.locale)) {
        _.set(result, `${localization.locale}`, {});
      }

      // Set the key in a json like:
      // { [locale]: { [key]: boolean } }
      result[localization.locale][localization.key] = exists;
    });

    return result;
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while deleting the locales');
  }
}

module.exports = {
  has,
  hasMany,
};
