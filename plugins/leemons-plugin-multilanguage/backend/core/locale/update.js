const { LeemonsError } = require('@leemons/error');
const { validateLocale } = require('../../validations/locale');

/**
 * Sets the given name to the locale that matches the code
 * If not locale exists with such code, it returns null
 * @param {Object} params
 * @param {LocaleCode} params.code The locale iso code xx-YY or xx
 * @param {LocaleName} params.name The display name of the given locale
 * @param {MoleculerContext} params.ctx Moleculer context
 * @returns {Promise<Locale | null>} null if the locale doesn't exist and the locale object if updated
 */
async function setName({ code, name, ctx }) {
  // Validates the locale and returns it with the codes lowercased
  const _code = validateLocale({ code, name }).code;

  try {
    return await ctx.tx.db.Locales.findOneAndUpdate(
      { code: _code },
      { code: _code, name },
      { upsert: true, new: true, lean: true }
    );
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new LeemonsError(ctx, { message: 'An error occurred while setting the locale' });
  }
}

module.exports = { setName };
