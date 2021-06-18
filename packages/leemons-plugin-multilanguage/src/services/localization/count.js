const {
  validateLocalizationTuple,
  validateLocalizationKey,
} = require('../../validations/localization');

const localizationsTable = leemons.query('plugins_multilanguage::localizations');

/**
 * Counts how many keys starts with the given key for the given locale
 * @param {LocalizationKey} key The localization key prefix
 * @param {LocaleCode} locale The desired locale
 * @returns {Promise<number>} how many keys exists
 */
async function countKeyStartsWith(key, locale) {
  // Validates the tuple and returns it in lowercase
  const tuple = validateLocalizationTuple({ key, locale });

  try {
    // Get the count of localizations in the given locale starting with the given tuple
    return await localizationsTable.count({ key_$startsWith: tuple.key, locale: tuple.locale });
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while counting the localizations');
  }
}

/**
 * Counts how many locales has a localization for the given key
 * @param {LocalizationKey} key
 * @returns {number} how many locales has the localization
 */
async function countLocalesWithKey(key) {
  // Validates the key and returns it lowercased
  const _key = validateLocalizationKey(key);

  try {
    return await localizationsTable.count({ key: _key });
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while counting the localizations');
  }
}

module.exports = {
  countKeyStartsWith,
  countLocalesWithKey,
};
