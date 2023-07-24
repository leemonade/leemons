const _ = require('lodash');
const { validateLocaleCode, validateLocaleCodeArray } = require('../../validations/locale');

/**
 * Gets the given locale info from the database
 * @param {Object} params
 * @param {LocaleCode} params.code The locale iso code xx-YY or xx
 * @param {MoleculerContext} params.ctx Moleculer context
 * @returns {Promise<Locale | null>} The locale
 */
async function get({ code, ctx }) {
  // Validates the code and returns it lowercased
  const _code = validateLocaleCode(code);

  try {
    return await ctx.tx.db.Locales.findOne({ code: _code }).lean();
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while getting the locale');
  }
}

/**
 * Gets the given locales form the database
 * @param {Object} params
 * @param {LocaleCode[]} params.codes The locale iso code xx-YY or xx
 * @param {MoleculerContext} params.ctx Moleculer context
 * @returns {Promise<Locale[]>} An array with the locales that exists
 */
async function getMany({ codes, ctx }) {
  // Validates the codes and returns them lowercased
  const _codes = validateLocaleCodeArray(codes);

  try {
    return await ctx.tx.db.Locales.find({ code: _codes }).lean();
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while getting the locales');
  }
}

/**
 * Gets all the existing locales in the database
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @returns {Promise<Locale[]>} An array with all the locales in the database
 */
async function getAll({ ctx }) {
  try {
    return await ctx.tx.db.Locales.find({ code: { $ne: null } }).lean();
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while getting all the locales');
  }
}

/**
 * Returns an array of locations in order of importance.
 * Your specific locales -> User locale -> Center locale -> Platform locale
 * @returns {Promise<string[]>} Locale array
 */
async function resolveLocales({ locales, ctx }) {
  let finalLocales = [];
  // Your specific locales
  if (locales) {
    finalLocales = finalLocales.concat(locales);
  }
  if (ctx.userSession) {
    // User locale
    if (ctx.userSession.locale) finalLocales.push(ctx.userSession.locale);
    // Center locale
    if (ctx.userSession.userAgents) {
      const centers = await ctx.tx.call('users.users.getUserAgentCenter', {
        userAgent: ctx.userSession.userAgents,
      });
      _.forEach(centers, ({ locale }) => {
        finalLocales.push(locale);
      });
    }
  }
  // Platform locale
  const platformLocale = await ctx.tx.call('users.platform.getDefaultLocale');
  if (platformLocale) {
    finalLocales.push(platformLocale);
  }

  return _.uniq(finalLocales);
}

module.exports = { get, getMany, getAll, resolveLocales };
