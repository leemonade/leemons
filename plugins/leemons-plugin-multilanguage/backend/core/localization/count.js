const { escapeRegExp } = require('lodash');

const { Validator } = require('../../validations/localization');
const {
  getLocalizationModelFromCTXAndIsPrivate,
} = require('./getLocalizationModelFromCTXAndIsPrivate');

/**
 * Counts how many keys starts with the given key for the given locale
 * @param {Object} params
 * @param {LocalizationKey} params.key The localization key prefix
 * @param {LocaleCode} params.locale The desired locale
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @returns {Promise<number>} how many keys exists
 */
async function countKeyStartsWith({ ctx, key, locale, isPrivate }) {
  // Validates the tuple and returns it in lowercase
  const validator = new Validator(ctx.callerPlugin);
  const tuple = validator.validateLocalizationTuple({ key, locale }, isPrivate);

  try {
    // Get the count of localizations in the given locale starting with the given tuple
    return await getLocalizationModelFromCTXAndIsPrivate({ ctx, isPrivate }).countDocuments({
      key: { $regex: `^${escapeRegExp(tuple.key)}`, $options: 'i' },
      locale: tuple.locale,
    });
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while counting the localizations');
  }
}

/**
 * Counts how many locales has a localization for the given key
 * @param {Object} params
 * @param {LocalizationKey} params.key
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @returns {number} how many locales has the localization
 */
async function countLocalesWithKey({ ctx, key, isPrivate } = {}) {
  // Validates the key and returns it lowercased
  const validator = new Validator(ctx.callerPlugin);
  const _key = validator.validateLocalizationKey(key, isPrivate);

  try {
    return await getLocalizationModelFromCTXAndIsPrivate({ isPrivate, ctx }).countDocuments({
      key: _key,
    });
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while counting the localizations');
  }
}

module.exports = { countKeyStartsWith, countLocalesWithKey };
