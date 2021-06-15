const validateLocale = require('../../../validations/locale');
const throwInvalid = require('../../../validations/throwInvalid');

const localizationsTable = leemons.query('plugins_multilanguage::localizations');

/**
 * Gets the given locale
 * @param {string} code The locale iso code xx-YY or xx
 * @returns {Promise<Locale> | null} The locale
 */
async function get(key, locale) {
  const _key = key.toLowerCase();
  const _locale = locale.toLowerCase();

  try {
    return await localizationsTable.findOne({ key: _key, locale: _locale });
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while getting the localization');
  }
}

async function getWithKey(key) {
  const _key = key.toLowerCase();

  try {
    return await localizationsTable.find({ key: _key });
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while getting the localizations');
  }
}

async function getWithLocale(locale) {
  const _locale = locale.toLowerCase();

  try {
    return await localizationsTable.find({ locale: _locale });
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while getting the localizations');
  }
}

async function getKeyValueWithLocale(locale) {
  const _locale = locale.toLowerCase();

  try {
    const localizations = await localizationsTable.find({ locale: _locale });

    return localizations.reduce((result, { key, value }) => {
      const _result = result;

      _result[key] = value;

      return _result;
    }, {});
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while getting the localizations');
  }
}

async function getKeyStartsWith(key, locale) {
  const _key = key.toLowerCase();
  const _locale = locale.toLowerCase();

  try {
    return await localizationsTable.find({ key_$startsWith: _key, locale: _locale });
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while getting the localization');
  }
}
async function getKeyValueStartsWith(key, locale) {
  const _key = key.toLowerCase();
  const _locale = locale.toLowerCase();

  try {
    const localizations = await localizationsTable.find({
      key_$startsWith: _key,
      locale: _locale,
    });

    return localizations.reduce((result, { key: lKey, value }) => {
      const _result = result;

      _result[lKey] = value;

      return _result;
    }, {});
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while getting the localization');
  }
}

module.exports = {
  get,
  getWithKey,
  getKeyValueWithLocale,
  getWithLocale,
  getKeyStartsWith,
  getKeyValueStartsWith,
};
