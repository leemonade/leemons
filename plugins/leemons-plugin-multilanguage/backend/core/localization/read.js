const _ = require('lodash');
const { validateLocaleCode } = require('../../validations/locale');
const { Validator } = require('../../validations/localization');
const {
  getLocalizationModelFromCTXAndIsPrivate,
} = require('./getLocalizationModelFromCTXAndIsPrivate');

function mergeTranslations(translations) {
  const keys = [];
  const result = [];
  _.forEach(translations, (items) => {
    _.forEach(items, (item) => {
      if (keys.indexOf(item.key) < 0) {
        keys.push(item.key);
        result.push(item);
      }
    });
  });
  return result;
}

/**
 * Gets the given localization
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {LocalizationKey} params.key The localization key
 * @param {LocaleCode} params.locale The locale iso code xx-YY or xx
 * @returns {Promise<Localization | null>} The requested localization or null
 */
async function get({ key, locale, ctx, isPrivate }) {
  const locales = _.isArray(locale) ? locale : [locale];
  // Validates the tuple and lowercase it
  const validator = new Validator(ctx.callerPlugin);
  const tuple = validator.validateLocalizationTuple({ key, locales }, isPrivate);

  try {
    const response = await getLocalizationModelFromCTXAndIsPrivate({
      isPrivate,
      ctx,
    })
      .find({
        key: tuple.key,
        locale: tuple.locales,
      })
      .lean();
    const responseByLocale = _.keyBy(response, 'locale');
    let result = null;
    _.forEach(locales, (l) => {
      if (responseByLocale[l]) {
        result = responseByLocale[l];
        return false;
      }
    });
    return result;
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while getting the localization');
  }
}

/**
 * Gets the given localization value
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {LocalizationKey} params.key The localization key
 * @param {LocaleCode} params.code The locale iso code xx-YY or xx
 * @returns {Promise<LocalizationValue | null>} The requested localization value or null
 */
async function getValue({ key, locale, isPrivate, ctx }) {
  const localization = await get({ key, locale, ctx, isPrivate });

  if (localization) {
    return localization.value;
  }
  return null;
}

/**
 * Gets many localization that matches the keys
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {LocalizationKey[]} params.keys
 * @returns {Localization[]}
 */
async function getManyWithKeys({ keys, isPrivate, ctx }) {
  // Validate keys array and lowercase them
  const validator = new Validator(ctx.callerPlugin);
  const _keys = validator.validateLocalizationKeyArray(keys, isPrivate);

  try {
    const foundLocalizations = await getLocalizationModelFromCTXAndIsPrivate({
      isPrivate,
      ctx,
    })
      .find({ key: _keys })
      .lean();

    const localizationsByKey = _.groupBy(foundLocalizations, 'key');

    return Object.keys(localizationsByKey).reduce((acc, key) => {
      acc[key] = {};
      _.forEach(localizationsByKey[key], ({ locale, value }) => {
        acc[key][locale] = value;
      });
      return acc;
    }, {});
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error ocurred while getting the localizations');
  }
}

/**
 * Gets many localization that matches the keys and the locale
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {LocalizationKey[]} params.keys
 * @param {LocaleCode} params.locale
 * @returns {Localization[]}
 */
async function getManyWithLocale({ keys, locale, isPrivate, ctx }) {
  const locales = _.isArray(locale) ? locale : [locale];
  // Validate keys array and lowercase them
  const validator = new Validator(ctx.callerPlugin);
  const _keys = validator.validateLocalizationKeyArray(keys, isPrivate);
  // Validate locale and lowercase it
  const _locales = _.map(locales, (locale) => validateLocaleCode(locale));

  try {
    const responses = await Promise.all(
      _.map(_locales, (locale) =>
        getLocalizationModelFromCTXAndIsPrivate({
          isPrivate,
          ctx,
        })
          .find({ key: _keys, locale })
          .lean()
      )
    );

    const foundLocalizations = mergeTranslations(responses);

    return _.fromPairs(
      foundLocalizations.map((localization) => [localization.key, localization.value])
    );
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error ocurred while getting the localizations');
  }
}

/**
 * Get all the localizations matching a key (different locales)
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {LocalizationKey} params.key
 * @returns {Localization[]}
 */
async function getWithKey({ key, isPrivate, ctx }) {
  // Validate the key and lowercase it
  const validator = new Validator(ctx.callerPlugin);
  const _key = validator.validateLocalizationKey(key, isPrivate);

  try {
    return await getLocalizationModelFromCTXAndIsPrivate({
      isPrivate,
      ctx,
    })
      .find({ key: _key })
      .lean();
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while getting the localizations');
  }
}

/**
 * Get all the localizations matching a key (different locales)
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {LocalizationKey} params.key
 * @returns {{[locale: string]: LocalizationValue} | null}
 */
async function getLocaleValueWithKey({ key, isPrivate, ctx }) {
  const localizations = await getWithKey({ key, isPrivate, ctx });

  // Return null if no localization is found
  return localizations.reduce((result, { locale, value }) => {
    const _result = result || {};

    _result[locale] = value;

    return _result;
  }, null);
}

/**
 * Gets all the localizations mathching a locale (different keys)
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {LocaleCode} params.locale
 * @returns {Localization[]}
 */
async function getWithLocale({ locale, isPrivate, ctx }) {
  // Validate the locale and lowercase it
  const _locale = validateLocaleCode(locale);

  const query = {
    locale: _locale,
  };

  if (isPrivate) {
    query.key = { $regex: `^${ctx.callerPlugin}`, $options: 'i' };
  }

  try {
    return await getLocalizationModelFromCTXAndIsPrivate({
      isPrivate,
      ctx,
    })
      .find(query)
      .lean();
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while getting the localizations');
  }
}

/**
 * Gets an object with keys and values of all the keys in a locale
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {LocaleCode} params.locale
 * @returns {{[key: string]: LocalizationValue} | null}
 */
async function getKeyValueWithLocale({ locale, isPrivate, ctx }) {
  try {
    const localizations = await getWithLocale({ locale, isPrivate, ctx });

    // Return null if no localization is found
    return localizations.reduce((result, { key, value }) => {
      const _result = result || {};

      _result[key] = value;

      return _result;
    }, null);
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while getting the localizations');
  }
}

/**
 * Gets all the keys for a locale starting with a prefix
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {LocalizationKey} params.key
 * @param {LocaleCode|LocaleCode[]} params.locale
 * @returns {Localization[]}
 */
async function getKeyStartsWith({ key, locale, isPrivate, ctx }) {
  const locales = _.isArray(locale) ? locale : [locale];
  // Validate the tuple and lowercase it
  const validator = new Validator(ctx.callerPlugin);
  const tuple = validator.validateLocalizationTuple({ key, locales }, isPrivate);

  try {
    const responses = await Promise.all(
      _.map(tuple.locales, (locale) =>
        getLocalizationModelFromCTXAndIsPrivate({
          isPrivate,
          ctx,
        }).find({ key: { $regex: `^${tuple.key}`, $options: 'i' }, locale })
      )
    );
    return mergeTranslations(responses);
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while getting the localization');
  }
}

/**
 * Gets an object of key value for all the keys starting with a prefix for a given locale
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {LocalizationKey} params.key
 * @param {LocaleCode} params.locale
 * @returns {{[key: string]: LocalizationValue} | null}
 */
async function getKeyValueStartsWith({ key, locale, isPrivate, ctx }) {
  try {
    const localizations = await getKeyStartsWith({ key, locale, isPrivate, ctx });

    // Return null if no localization is found
    return localizations.reduce((result, { key: lKey, value }) => {
      const _result = result || {};

      _result[lKey] = value;

      return _result;
    }, null);
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while getting the localization');
  }
}

module.exports = {
  get,
  getValue,
  getManyWithKeys,
  getManyWithLocale,
  getWithKey,
  getLocaleValueWithKey,
  getWithLocale,
  getKeyValueWithLocale,
  getKeyStartsWith,
  getKeyValueStartsWith,
};
