const _ = require('lodash');
const validateLocale = require('../../../validations/locale');
const validateKey = require('../../../validations/key');
const validateDataType = require('../../../validations/datatypes');
const throwInvalid = require('../../../validations/throwInvalid');

const { has: hasLocale, hasMany: hasLocales } = require('../locale/has');
const { has: hasLocalization, hasMany: hasLocalizations } = require('./has');

const { LeemonsValidator } = global.utils;

const localizationsTable = leemons.query('plugins_multilanguage::localizations');

LeemonsValidator.ajv.addFormat('localizationKey', {
  validate: (x) => /^([a-z][a-z0-9_-]+\.){0,}[a-z][a-z0-9_-]+$/.test(x),
});

/**
 * Adds one locale
 * @param {string} key The localization key
 * @param {string} locale The locale for the localization
 * @param {string} value The value for the entry
 * @returns {Promise<Localization> | Promise<null>} null if the locale already exists and the locale object if created
 * @param
 */

async function add(key, locale, value) {
  const _locale = locale.toLowerCase();
  const _key = key.toLowerCase();

  throwInvalid(validateLocale(_locale));
  throwInvalid(validateKey(key));
  throwInvalid(validateDataType(value, { type: 'string', minLength: 1, maxlength: 65535 }));

  try {
    if (!(await hasLocalization(_key, _locale))) {
      if (await hasLocale(_locale)) {
        // Create the new localization
        return await localizationsTable.create({ key: _key, locale: _locale, value });
      }

      // The given locale does not exists
      throw new Error('Invalid locale');
    }
    // No localization created (already exists)
    return null;
  } catch (e) {
    if (e.message === 'Invalid locale') {
      throw e;
    }
    leemons.log.debug(e.message);
    throw new Error('An error occurred while creating the localization');
  }
}

// TODO: Add JSDOC and data validation
async function addMany(data) {
  const locales = Object.keys(data);

  // Get the existing locales
  const existingLocales = Object.entries(await hasLocales(locales))
    .filter(([, exists]) => exists)
    .map(([locale]) => locale);

  // Get the localizations for the existing locales (flat array)
  const localizations = _.flatten(
    Object.entries(_.pick(data, existingLocales)).map(([locale, values]) =>
      Object.entries(values).map(([key, value]) => ({ key, locale, value }))
    )
  );

  // Get the DB existing localizations
  const existingLocalizations = await hasLocalizations(
    localizations.map(({ key, locale }) => [key, locale])
  );

  // Get the new localizations
  const newLocalizations = localizations.filter(
    ({ key, locale }) => !existingLocalizations[locale][key]
  );

  try {
    // Create the new localizations
    const addedLocalizations = await localizationsTable.createMany(newLocalizations);

    // #region Define Warning object

    // Get an array of the non existing locales
    const nonExistingLocales = locales.filter((locale) => !existingLocales.includes(locale));
    // Get an object with the existing keys: { en: ['key.1', 'key.2'] }, if no existing key: null
    const existingKeys = Object.entries(existingLocalizations).reduce((result, [locale, keys]) => {
      const _result = result === null ? {} : result;
      const _keys = Object.entries(keys)
        .filter(([, exists]) => exists)
        .map(([_key]) => _key);

      if (!_keys.length) {
        return result;
      }
      _result[locale] = _keys;
      return _result;
    }, null);

    let hasWarnings = false;
    let warnings = {};

    // Set non existing language warning
    if (nonExistingLocales.length) {
      hasWarnings = true;
      warnings.nonExistingLocales = nonExistingLocales;
    }

    // Set existing keys warning
    if (existingKeys !== null) {
      hasWarnings = true;
      warnings.existingKeys = existingKeys;
    }

    if (!hasWarnings) {
      warnings = null;
    }
    // #endregion

    return {
      items: addedLocalizations,
      count: addedLocalizations.length,
      warnings,
    };
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while creating the localizations');
  }
}

// TODO: Add JSDOC and data validation
async function addManyByKey(key, data) {
  const locales = Object.keys(data);

  // Get the existing locales
  const existingLocales = Object.entries(await hasLocales(locales))
    .filter(([, exists]) => exists)
    .map(([locale]) => locale);

  // Get the localizations for the existing locales (flat array)
  const localizations = _.flatten(
    Object.entries(_.pick(data, existingLocales)).map(([locale, value]) => ({ key, locale, value }))
  );

  const existingLocalizations = await hasLocalizations(
    localizations.map(({ key: _key, locale }) => [_key, locale])
  );

  const newLocalizations = localizations.filter(
    ({ key: _key, locale }) => !existingLocalizations[locale][_key]
  );

  try {
    const addedLocalizations = await localizationsTable.createMany(newLocalizations);

    // #region Define Warning object

    // Get an array of the non existing locales
    const nonExistingLocales = locales.filter((locale) => !existingLocales.includes(locale));
    // Get an array with the existing localized locales: ['en', 'es']
    const _existingLocalizations = Object.entries(existingLocalizations)
      .filter(([, keys]) => Object.values(keys)[0])
      .map(([locale]) => locale);

    let hasWarnings = false;
    let warnings = {};

    // Set non existing language warning
    if (nonExistingLocales.length) {
      hasWarnings = true;
      warnings.nonExistingLocales = nonExistingLocales;
    }

    // Set existing keys warning
    if (_existingLocalizations.length) {
      hasWarnings = true;
      warnings.existingLocalizations = _existingLocalizations;
    }

    if (!hasWarnings) {
      warnings = null;
    }
    // #endregion

    return {
      items: addedLocalizations,
      count: addedLocalizations.length,
      warnings,
    };
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while creating the localizations');
  }
}

module.exports = { add, addMany, addManyByKey };
