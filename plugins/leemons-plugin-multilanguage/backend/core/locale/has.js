const _ = require('lodash');
const { validateLocaleCode, validateLocaleCodeArray } = require('../../validations/locale');

/**
 * Checks if the given locale exists
 * @param {Object} params
 * @param {LocaleCode} params.code The locale iso code xx-YY or xx
 * @param {MoleculerContext} params.ctx Moleculer context
 *
 * @returns {Promise<boolean>} if the locale exists
 */
async function has({ code, ctx }) {
  // Validates the code and returns it in lowercase
  const _code = validateLocaleCode(code);

  try {
    return (await ctx.tx.db.Locales.countDocuments({ code: _code })) > 0;
    // Get if there is at least 1 locale with the given code
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while creating the locale');
  }
}

/**
 * Checks if the given locales exists
 * @param {Object} params
 * @param {LocaleCode[]} params.codes The locale iso code xx-YY or xx
 * @param {MoleculerContext} params.ctx Moleculer context
 *
 * @returns {Promise<Object<string, boolean>>} An array with the locales that exists
 */
async function hasMany({ codes, ctx }) {
  // Validates the code and returns them lowercased
  const _codes = validateLocaleCodeArray(codes);

  try {
    // Find the locales that exists in the database
    let existingLocales = await ctx.tx.db.Locales.find({ code: _codes })
      .select(['_id', 'code'])
      .lean();
    existingLocales = existingLocales.map((locale) => locale.code);

    // Generate an object of {locale: boolean}
    const result = _.fromPairs(_codes.map((code) => [code, existingLocales.includes(code)]));

    return { ...result };
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while deleting the locales');
  }
}

module.exports = { has, hasMany };
