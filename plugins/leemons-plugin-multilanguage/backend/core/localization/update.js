const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { getObjectArrayKeys } = require('leemons-utils');
const { Validator } = require('../../validations/localization');
const {
  getLocalizationModelFromCTXAndIsPrivate,
} = require('./getLocalizationModelFromCTXAndIsPrivate');
const localesFunctions = require('../locale');
/**
 * Sets the value of a locale, if this does not exists, it creates it
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {LocalizationKey} params.key The localization key
 * @param {LocaleCode} params.locale The locale for the localization
 * @param {LocalizationValue} params.value The value for the entry
 * @returns {Promise<Localization | null>} null if the locale already exists and the locale object if created
 */
async function setValue({ key, locale, value, isPrivate, ctx }) {
  // Validates the localization and returns it with the key and locale lowercased
  const validator = new Validator(ctx.callerPlugin);
  const { key: _key, locale: _locale } = validator.validateLocalization(
    { key, locale, value },
    true
  );
  try {
    if (!(await localesFunctions.has({ code: _locale, ctx }))) {
      throw new Error('Invalid locale');
    }
    return await getLocalizationModelFromCTXAndIsPrivate({
      isPrivate,
      ctx,
    }).findOneAndUpdate(
      { key: _key, locale: _locale },
      { key: _key, locale: _locale, value },
      { upsert: true, lean: true, new: true }
    );
  } catch (e) {
    if (e.message === 'Invalid locale') {
      throw e;
    }

    ctx.logger.debug(e.message);
    throw new LeemonsError(ctx, { message: 'An error occurred while updating the localization' });
  }
}

/**
 * Sets the values for a key in different locales
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {LocalizationKey} params.key
 * @param {{[key:string]: LocalizationValue}} params.data
 * @returns {Promise<{items: Localization[],count: number, warnings: {nonExistingLocales: LocaleCode[] | undefined, existingLocalizations: LocaleCode[] | undefined} | null}}
 */
async function setKey({ key, data, isPrivate, ctx }) {
  const validator = new Validator(ctx.callerPlugin);
  // Validates the key and returns it lowercased
  const _key = validator.validateLocalizationKey(key, true);
  // Validates the tuples [locale, value] and lowercases the locale
  const _data = validator.validateLocalizationLocaleValue(data);

  const locales = Object.keys(_data);

  // Get the existing locales
  const existingLocales = Object.entries(await localesFunctions.hasMany({ codes: locales, ctx }))
    .filter(([, exists]) => exists)
    .map(([locale]) => locale);

  // Get the localizations for the existing locales (flat array)
  const localizations = _.flatten(
    Object.entries(_.pick(_data, existingLocales)).map(([locale, value]) => ({
      key: _key,
      locale,
      value,
    }))
  );

  try {
    const updatedLocalizations = await Promise.all(
      localizations.map((localization) => {
        const { value, ...query } = localization;

        return getLocalizationModelFromCTXAndIsPrivate({
          isPrivate,
          ctx,
        }).findOneAndUpdate(query, { ...query, value }, { upsert: true, lean: true, new: true });
      })
    );

    // #region Define Warning object

    // Get an array of the non existing locales
    const nonExistingLocales = locales.filter((locale) => !existingLocales.includes(locale));

    let warnings = null;

    // Set non existing language warning
    if (nonExistingLocales.length) {
      warnings = { nonExistingLocales };
    }

    // #endregion

    return {
      items: updatedLocalizations,
      count: updatedLocalizations.length,
      warnings,
    };
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new LeemonsError(ctx, { message: 'An error occurred while creating the localizations' });
  }
}

/**
 * Sets many localizations to the database
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {{[locale:string]: {[key:string]: LocalizationValue}}} params.data
 * @returns {Promise<{items: Localization[],count: number, warnings: {nonExistingLocales: LocaleCode[] | undefined, existingKeys: LocalizationKey[] | undefined} | null}>}
 */
async function setMany({ data, isPrivate, ctx }) {
  // Validate params
  const validator = new Validator(ctx.callerPlugin);
  validator.validateLocalizationsBulk(data);

  const locales = Object.keys(data);

  // Get the existing locales
  const existingLocales = Object.entries(await localesFunctions.hasMany({ codes: locales, ctx }))
    .filter(([, exists]) => exists)
    .map(([locale]) => locale);

  // Get an array of the non existing locales
  const nonExistingLocales = [];

  // Get the localizations for the existing locales (flat array)
  let localizations = _.flatten(
    Object.entries(
      _.pickBy(data, (value, key) => {
        const exists = existingLocales.includes(key);
        if (!exists) {
          nonExistingLocales.push(key);
        }
        return exists;
      })
    ).map(([locale, values]) =>
      Object.entries(values).map(([key, value]) => ({ key, locale, value }))
    )
  );
  // Validate the keys
  localizations = validator.validateLocalizationsArray(localizations, true);

  try {
    // Create the new localizations
    const modifiedLocalizations = await Promise.all(
      localizations.map((localization) => {
        const { value, ...query } = localization;
        return getLocalizationModelFromCTXAndIsPrivate({
          isPrivate,
          ctx,
        }).findOneAndUpdate(query, { ...query, value }, { upsert: true, lean: true, new: true });
      })
    );

    // #region Define Warning object

    let warnings = null;

    // Set non existing language warning
    if (nonExistingLocales.length) {
      warnings = { nonExistingLocales };
    }

    // #endregion

    return {
      items: modifiedLocalizations,
      count: modifiedLocalizations.length,
      warnings,
    };
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new LeemonsError(ctx, { message: 'An error occurred while creating the localizations' });
  }
}

async function setManyByKey({ key, data, isPrivate, ctx }) {
  const validator = new Validator(ctx.callerPlugin);
  // Validates the key and returns it lowercased
  const _key = validator.validateLocalizationKey(key, true);
  // Validates the tuples [locale, value] and lowercases the locale
  const _data = validator.validateLocalizationLocaleValue(data);

  const locales = Object.keys(_data);

  // Get the existing locales
  const existingLocales = Object.entries(await localesFunctions.hasMany({ codes: locales, ctx }))
    .filter(([, exists]) => exists)
    .map(([locale]) => locale);

  // Get the localizations for the existing locales (flat array)
  const localizations = _.flatten(
    Object.entries(_.pick(_data, existingLocales)).map(([locale, value]) => ({
      key: _key,
      locale,
      value,
    }))
  );

  const newLocalizations = localizations.map(({ key: __key, locale, value }) => ({
    query: { key: __key, locale },
    item: { value },
  }));

  try {
    const addedLocalizations = await Promise.all(
      _.map(newLocalizations, (newLocalization) =>
        getLocalizationModelFromCTXAndIsPrivate({
          isPrivate,
          ctx,
        }).findOneAndUpdate(
          newLocalization.query,
          {
            ...newLocalization.query,
            ...newLocalization.item,
          },
          { upsert: true, lean: true, new: true }
        )
      )
    );

    // #region Define Warning object

    // Get an array of the non existing locales
    const nonExistingLocales = locales.filter((locale) => !existingLocales.includes(locale));

    let hasWarnings = false;
    let warnings = {};

    // Set non existing language warning
    if (nonExistingLocales.length) {
      hasWarnings = true;
      warnings.nonExistingLocales = nonExistingLocales;
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
    throw new LeemonsError(ctx, { message: 'An error occurred while creating the localizations' });
  }
}

async function setManyByJSON({ data, isPrivate, ctx }) {
  const toAdd = {};
  _.forIn(data, (json, lang) => {
    toAdd[lang] = {};
    _.forEach(getObjectArrayKeys(json), (key) => {
      toAdd[lang][`${ctx.callerPlugin}.${key}`] = _.get(data[lang], key);
    });
  });

  return setMany({ data: toAdd, isPrivate, ctx });
}

module.exports = {
  setValue,
  setKey,
  setMany,
  setManyByKey,
  setManyByJSON,
};
