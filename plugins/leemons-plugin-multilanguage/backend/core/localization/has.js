const _ = require('lodash');
const { Validator } = require('../../validations/localization');
const {
  getLocalizationModelFromCTXAndIsPrivate,
} = require('./getLocalizationModelFromCTXAndIsPrivate');
/**
 * Checks if the given localization tuple exists
 * @param {Object} params
 * @param {LocalizationKey} params.key The localization key
 * @param {LocaleCode} params.locale The desired locale
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @returns {Promise<boolean>} if the localization exists
 */
async function has({ key, locale, isPrivate, ctx }) {
  const validator = new Validator(ctx.callerPlugin);
  const tuple = validator.validateLocalizationTuple({ key, locale }, isPrivate);

  try {
    return (
      (await getLocalizationModelFromCTXAndIsPrivate({ isPrivate, ctx }).countDocuments(tuple)) ===
      1
    );
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while checking if the localization exists');
  }
}

/**
 * Checks if the given localizations exists
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {Boolean} params.isPrivate Define if translation is private
 * @param {Array<LocalizationKey, LocaleCode>[]} params.localizations An array of localization objects
 * @returns {Promise<{[locale:string]: {[key:string]:boolean}}>} An array with the localizations that exists
 */
async function hasMany({ localizations, isPrivate, ctx }) {
  // Validates the localizations and lowercase each tuple
  const validator = new Validator(ctx.callerPlugin);
  const _localizations = validator.validateLocalizationTupleArray(localizations, isPrivate);

  try {
    const existingLocalizations = await getLocalizationModelFromCTXAndIsPrivate({ isPrivate, ctx })
      .find({ $or: _localizations })
      .select(['id', 'key', 'locale'])
      .lean();

    const result = {};

    _localizations.forEach((localization) => {
      // Find if the given tuple exists in the database
      const exists =
        existingLocalizations.findIndex(
          (existingLocalization) =>
            existingLocalization.key === localization.key &&
            existingLocalization.locale === localization.locale
        ) !== -1;

      if (!_.has(result, localization.locale)) {
        _.set(result, `${localization.locale}`, {});
      }

      // Set the key in a json like:
      // { [locale]: { [key]: boolean } }
      result[localization.locale][localization.key] = exists;
    });

    return result;
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while deleting the locales');
  }
}

module.exports = { has, hasMany };
