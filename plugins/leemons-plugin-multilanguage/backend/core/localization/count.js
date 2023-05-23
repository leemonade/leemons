const { Validator } = require("../../validations/localization");

/**
 * Counts how many keys starts with the given key for the given locale
 * @param {LocalizationKey} key The localization key prefix
 * @param {LocaleCode} locale The desired locale
 * @returns {Promise<number>} how many keys exists
 */
async function countKeyStartsWith(
  ctx,
  key,
  locale,
  { model, private, transacting } = {}
) {
  // Validates the tuple and returns it in lowercase
  const validator = new Validator(ctx.caller);
  const tuple = validator.validateLocalizationTuple({ key, locale }, private);

  try {
    // Get the count of localizations in the given locale starting with the given tuple
    return await model.countDocuments(
      { key: { $regex: "^" + tuple.key, $options: "i" }, locale: tuple.locale },
      { transacting }
    );
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error("An error occurred while counting the localizations");
  }
}

/**
 * Counts how many locales has a localization for the given key
 * @param {LocalizationKey} key
 * @returns {number} how many locales has the localization
 */
async function countLocalesWithKey(key, { transacting } = {}) {
  // Validates the key and returns it lowercased
  const _key = this.validator.validateLocalizationKey(key, this.private);

  try {
    return await this.model.count({ key: _key }, { transacting });
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error("An error occurred while counting the localizations");
  }
}
