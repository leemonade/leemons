const { escapeRegExp } = require('lodash');

const { validateLocaleCode } = require('../../validations/locale');
const { Validator } = require('../../validations/localization');
const {
  getLocalizationModelFromCTXAndIsPrivate,
} = require('./getLocalizationModelFromCTXAndIsPrivate');
const { commonNamespace } = require('../../helpers/cacheKeys');

/**
 * Deletes the localization that matches the tuple [key, locale]
 * @param {Object} params
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {LocalizationKey} params.key the entry key
 * @param {LocaleCode} params.locale the locale code
 * @param {MoleculerContext} params.ctx Moleculer context
 * @returns {Promise<boolean>} if the locale was deleted or not
 */
async function _delete({ key, locale, isPrivate, ctx }) {
  const validator = new Validator(ctx.callerPlugin);
  const tuple = validator.validateLocalizationTuple({ key, locale }, true);

  try {
    // Delete the given tuple
    return (
      (
        await getLocalizationModelFromCTXAndIsPrivate({
          isPrivate,
          ctx,
        }).deleteMany(tuple)
      ).deletedCount === 1
    );
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while deleting the localization');
  }
}

/**
 * Deletes the localizations that matches the key prefix
 *
 * If not locale provided, remove all the keys matching the prefix in any locale
 *
 * @param {Object} params
 * @param {LocalizationKey} params.key The key prefix
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {LocaleCode} params.locale the locale code
 * @returns {Promise<number>} how many localizations where deleted
 */
async function deleteKeyStartsWith({ key, locale = null, isPrivate, ctx }) {
  const validator = new Validator(ctx.callerPlugin);
  const query = {
    // Validate key and get it lowercased
    key: {
      $regex: `^${escapeRegExp(validator.validateLocalizationKey(key, true))}`,
      $options: 'i',
    },
  };

  if (locale) {
    // Validate locales and get it lowercased
    query.locale = validateLocaleCode(locale);
  }

  try {
    return (
      await getLocalizationModelFromCTXAndIsPrivate({
        isPrivate,
        ctx,
      }).deleteMany(query)
    ).deletedCount;
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while deleting the localizations');
  }
}

/**
 * Deletes the localizations that matches the tuple [key, locale]
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {Array<LocalizationKey, LocaleCode>[]} params.localizations An array of [key, locale]
 * @returns {Promise<Number>} The number of localizations deleted
 */
async function deleteMany({ localizations, isPrivate, ctx }) {
  // Validates the input and returns an array of LocalizationTuples ([{key, locale}])
  const validator = new Validator(ctx.callerPlugin);
  const _localizations = validator.validateLocalizationTupleArray(localizations, true);

  try {
    return (
      await getLocalizationModelFromCTXAndIsPrivate({
        isPrivate,
        ctx,
      }).deleteMany({ $or: _localizations })
    ).deletedCount;
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while deleting the localizations');
  }
}

/**
 * Deletes all the entries mathching a key or locale
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {LocalizationKey} params.key The key to delete
 * @param {LocaleCode} params.locale The locale to delete
 * @returns {number} the number of items deleted
 */
async function deleteAll({ key = null, locale = null, isPrivate, ctx }) {
  const query = {};

  if (key) {
    const validator = new Validator(ctx.callerPlugin);
    query.key = validator.validateLocalizationKey(key, true);
  }
  if (locale) {
    query.key = { $regex: `^${escapeRegExp(ctx.callerPlugin)}`, $options: 'i' };
    query.locale = validateLocaleCode(locale);
  }

  if (!query.key && !query.locale) {
    throw new Error('At least one parameter should be provided');
  }

  try {
    ctx.cache.deleteByNamespace(commonNamespace, (cacheKey) =>
      cacheKey.startsWith(`${commonNamespace}:${ctx.meta.deploymentID}`)
    );

    return (
      await getLocalizationModelFromCTXAndIsPrivate({
        isPrivate,
        ctx,
      }).deleteMany(query)
    ).deletedCount;
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while deleting the localizations');
  }
}

module.exports = { delete: _delete, deleteKeyStartsWith, deleteMany, deleteAll };
