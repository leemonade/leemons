const _ = require('lodash');

const { getObjectArrayKeys } = require('leemons-utils');
const localesFunctions = require('../locale');
const { Validator } = require('../../validations/localization');
const { has } = require('./has');
const {
  getLocalizationModelFromCTXAndIsPrivate,
} = require('./getLocalizationModelFromCTXAndIsPrivate');
const { hasMany } = require('./has');

/**
 * Adds one locale
 * @param {Object} params
 * @param {LocalizationKey} params.key The localization key
 * @param {LocaleCode} params.locale The locale for the localization
 * @param {LocalizationValue} params.value The value for the entry
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @returns {Promise<Localization | null>} null if the locale already exists and the locale object if created
 */
async function add({ key, locale, value, isPrivate, ctx }) {
  // Validates the localization and returns it with the key and locale lowercased
  const validator = new Validator(ctx.callerPlugin);
  const { key: _key, locale: _locale } = validator.validateLocalization(
    {
      key,
      locale,
      value,
    },
    true
  );

  try {
    // Check if the localization exists
    if (!(await has({ key: _key, locale: _locale, isPrivate, ctx }))) {
      // Check if the locale exists
      const localeChecked = await localesFunctions.has({ code: _locale, ctx });
      if (localeChecked || ['es', 'en'].includes(_locale)) {
        // Create the new localization
        return getLocalizationModelFromCTXAndIsPrivate({ isPrivate, ctx }).create({
          key: _key,
          locale: _locale,
          value,
        });
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
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while creating the localization');
  }
}

/**
 * Adds many localizations to the database
 * @param {Object} params
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {{[locale:string]: {[key:string]: LocalizationValue}}} params.data
 * @returns {Promise<{items: Localization[],count: number, warnings: {nonExistingLocales: LocaleCode[] | undefined, existingKeys: LocalizationKey[] | undefined} | null}>}
 */
async function addMany({ data, isPrivate, ctx }) {
  // Validate params
  const validator = new Validator(ctx.callerPlugin);
  validator.validateLocalizationsBulk(data);

  const locales = Object.keys(data);

  // Get the existing locales
  const existingLocales = Object.entries(await localesFunctions.hasMany({ codes: locales, ctx }))
    .filter(([, exists]) => exists)
    .map(([locale]) => locale)
    .concat(['es', 'en']);

  // Get the localizations for the existing locales (flat array)
  let localizations = _.flatten(
    Object.entries(_.pick(data, existingLocales)).map(([locale, values]) =>
      Object.entries(values).map(([key, value]) => ({ key, locale, value }))
    )
  );

  // Validate localizations formats (get them with key and locale lowercased)
  localizations = validator.validateLocalizationsArray(localizations, true);

  // Get the DB existing localizations
  const existingLocalizations = await hasMany({
    localizations: localizations.map(({ key, locale }) => [key, locale]),
    isPrivate,
    ctx,
  });

  // Get the new localizations
  const newLocalizations = localizations.filter(
    ({ key, locale }) => !existingLocalizations[locale][key]
  );

  try {
    // Create the new localizations
    const addedLocalizations = await getLocalizationModelFromCTXAndIsPrivate({
      isPrivate,
      ctx,
    }).insertMany(newLocalizations, { lean: true });

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
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while creating the localizations');
  }
}

/**
 * Adds many localizations to the database
 * @param {Object} params
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {String} params.prefix Moleculer context
 * @param {{[locale:string]: {[key:string]: LocalizationValue}}} params.data
 * @returns {Promise<{items: Localization[],count: number, warnings: {nonExistingLocales: LocaleCode[] | undefined, existingKeys: LocalizationKey[] | undefined} | null}>}
 */
async function addManyByJSON({ data, prefix, isPrivate, ctx }) {
  const toAdd = {};
  _.forIn(data, (json, lang) => {
    toAdd[lang] = {};
    _.forEach(getObjectArrayKeys(json), (key) => {
      toAdd[lang][`${prefix}${key}`] = _.get(data[lang], key);
    });
  });

  return addMany({ data: toAdd, ctx, isPrivate });
}

/**
 * Adds many localizations to the database for the same key
 * @param {Object} params
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {LocalizationKey} params.key
 * @param {{[key:string]: LocalizationValue}} params.data
 * @returns {Promise<{items: Localization[],count: number, warnings: {nonExistingLocales: LocaleCode[] | undefined, existingLocalizations: LocaleCode[] | undefined} | null}}
 */
async function addManyByKey({ key, data, ctx, isPrivate }) {
  // Validates the key and returns it lowercased
  const validator = new Validator(ctx.callerPlugin);
  const _key = validator.validateLocalizationKey(key, true);
  // Validates the tuples [locale, value] and lowercases the locale
  const _data = validator.validateLocalizationLocaleValue(data);

  const locales = Object.keys(_data);

  // Get the existing locales
  const existingLocales = Object.entries(await localesFunctions.hasMany({ codes: locales, ctx }))
    .filter(([, exists]) => exists)
    .map(([locale]) => locale)
    .concat(['es', 'en']);

  // Get the localizations for the existing locales (flat array)
  const localizations = _.flatten(
    Object.entries(_.pick(_data, existingLocales)).map(([locale, value]) => ({
      key: _key,
      locale,
      value,
    }))
  );

  const existingLocalizations = await hasMany({
    localizations: localizations.map(({ key: __key, locale }) => [__key, locale]),
    isPrivate,
    ctx,
  });

  const newLocalizations = localizations.filter(
    ({ key: __key, locale }) => !existingLocalizations[locale][__key]
  );

  try {
    const addedLocalizations = await getLocalizationModelFromCTXAndIsPrivate({
      isPrivate,
      ctx,
    }).insertMany(newLocalizations, {
      lean: true,
    });

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
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while creating the localizations');
  }
}

module.exports = { add, addMany, addManyByJSON, addManyByKey };
