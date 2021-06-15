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
async function countKeyStartsWith(key, locale) {
  const _key = key.toLowerCase();
  const _locale = locale.toLowerCase();

  throwInvalid(validateKey(_key));
  throwInvalid(validateLocale(_locale));

  try {
    return await localizationsTable.count({ key_$startsWith: _key, locale: _locale });
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while checking if the localization exists');
  }
}

async function countLocalesWithKey(key) {
  const _key = key.toLowerCase();

  throwInvalid(validateKey(_key));

  try {
    return await localizationsTable.count({ key: _key });
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while checking if the localization exists');
  }
}

module.exports = {
  countKeyStartsWith,
  countLocalesWithKey,
};
