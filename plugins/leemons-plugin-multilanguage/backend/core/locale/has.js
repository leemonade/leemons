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
  let start, end;

  // Validates the code and returns it in lowercase
  start = performance.now();
  const _code = validateLocaleCode(code);
  end = performance.now();
  console.log(`Execution time for validating locale code: ${end - start} ms`);

  try {
    // Get if there is at least 1 locale with the given code
    start = performance.now();
    const result = (await ctx.tx.db.Locales.countDocuments({ code: _code })) > 0;
    end = performance.now();
    console.log(`Execution time for checking locale existence: ${end - start} ms`);
    return result;
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
  let start, end;

  // Validates the code and returns them lowercased
  const _codes = validateLocaleCodeArray(codes);

  try {
    // Find the locales that exists in the database
    start = performance.now();

    console.log('Vamos a hacer el find');
    let existingLocales = await ctx.tx.db.Locales.find({ code: _codes })
      .select(['id', 'code'])
      .lean();
    end = performance.now();
    console.log('_codes', _codes);
    console.log(`Execution time for finding existing locales: ${end - start} ms`);

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
