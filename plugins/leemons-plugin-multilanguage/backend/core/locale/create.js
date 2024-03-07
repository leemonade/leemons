const { LeemonsError } = require('@leemons/error');
const { validateLocale, validateLocalesArray } = require('../../validations/locale');
const { has, hasMany } = require('./has');

/**
 * Adds one locale to the database if it does not exist
 *
 * @param {Object} params
 * @param {LocaleCode} params.code The locale iso code xx-YY or xx
 * @param {LocaleName} params.name The display name of the given locale
 * @param {MoleculerContext} params.ctx Moleculer context
 *
 * @returns {Promise<Locale | null>} null if the locale already exists and the locale object if created
 */
async function add({ code, name, ctx }) {
  // Validate the locale and get the code in lowercase
  const locale = validateLocale({ code, name });

  try {
    // If the locale does not exist, create it
    if (!(await has({ code: locale.code, ctx }))) {
      const dbLocaleDoc = await ctx.tx.db.Locales.create(locale);
      const dbLocale = dbLocaleDoc.toObject();
      await ctx.tx.emit('newLocale', dbLocale);
      return dbLocale;
    }
    // If already exists, return null
    return null;
  } catch (e) {
    ctx.logger.error(e.message);
    throw new LeemonsError(ctx, { message: 'An error occurred while creating the locale' });
  }
}

/**
 * Adds many locales to the database. Only adds those not existing
 *
 * @param {Object} params
 * @param {Array<Array<LocaleCode, LocaleName>>} params.locales An array of locales ([code, name])
 * @param {MoleculerContext} params.ctx Moleculer context
 *
 * @returns {Promise<Locale[]>} if all the locales already exists and an array of locale objects created
 *
 * @example
 * addMany([
 *  ['es-ES', 'Español de España'],
 *  ['en-US', 'English of the United States'],
 * ]);
 */
async function addMany({ ctx, locales }) {
  // Validate the locales and get an array of Locale objects
  const _locales = validateLocalesArray(locales);

  const codes = _locales.map((locale) => locale.code);

  // Check for duplicated codes
  if (codes.length > [...new Set(codes)].length) {
    throw new LeemonsError(ctx, { message: 'The inserted locale codes should be unique' });
  }

  try {
    // Check which of the provided locales exists
    const existingLocales = await hasMany({ codes, ctx });

    // Get the locales not present in the database
    const newLocales = _locales.filter((locale) => !existingLocales[locale.code]);

    // If not newLocales, return an empty array
    if (newLocales.length === 0) {
      return [];
    }

    // Return the new locales
    const addedLocalesDoc = await ctx.tx.db.Locales.create(newLocales);
    const addedLocales = addedLocalesDoc.toObject();
    ctx.logger.debug(
      `New locales added: ${newLocales
        .map((locale) => `${locale.code} | ${locale.name}`)
        .join(', ')}`
    );
    return addedLocales;
  } catch (e) {
    ctx.logger.error(e.message);
    throw new LeemonsError(ctx, { message: 'An error occurred while creating the locales' });
  }
}

module.exports = { add, addMany };
