const _ = require('lodash');
const validateLocale = require('../../../validations/locale');
const validateKey = require('../../../validations/key');
const validateDataType = require('../../../validations/datatypes');
const throwInvalid = require('../../../validations/throwInvalid');

const { has: hasLocale, hasMany: hasLocales } = require('../locale/has');
const { has: hasLocalization, hasMany: hasLocalizations } = require('./has');

const localizationsTable = leemons.query('plugins_multilanguage::localizations');

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
    if ((await localizationsTable.count({ key: _key, locale: _locale })) === 0) {
      if (await hasLocale(_locale)) {
        return await localizationsTable.create({ key: _key, locale: _locale, value });
      }

      throw new Error('Invalid locale');
    }
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

  const existingLocalizations = await hasLocalizations(
    localizations.map(({ key, locale }) => [key, locale])
  );

  const newLocalizations = localizations.filter(
    ({ key, locale }) => !existingLocalizations[locale][key]
  );

  try {
    return await localizationsTable.createMany(newLocalizations);
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
    return await localizationsTable.createMany(newLocalizations);
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while creating the localizations');
  }
}

module.exports = { add, addMany, addManyByKey };
