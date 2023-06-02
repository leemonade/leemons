const { validateLocaleCode, validateLocaleCodeArray } = require('../../validations/locale');
/**
 * Deletes the locale that matches the code
 * @param {Object} params
 * @param {string} params.code The locale iso code xx-YY or xx
 * @param {MoleculerContext} params.ctx Moleculer context
 *
 * @returns {Promise<Boolean>} if the locale was deleted or not
 */
async function _delete({ code, ctx }) {
  // Validates the code and returns it in lowercase
  const _code = validateLocaleCode(code);

  try {
    return !!(await ctx.tx.db.Locales.deleteOne({ code: _code })).deletedCount;
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while deleting the locale');
  }
}

/**
 * Deletes the locales that matches the codes array
 * @param {Object} params
 * @param {string[]} params.codes An array of the locales iso codes xx-YY or xx
 * @param {MoleculerContext} params.ctx Moleculer context
 * @returns {Promise<Number>} The number of locales deleted
 */
async function deleteMany({ codes, ctx }) {
  // Validates the codes and returns them in lowercase
  const _codes = validateLocaleCodeArray(codes);

  try {
    return (await ctx.tx.db.Locales.deleteMany({ code: _codes })).deletedCount;

    // Delete the given codes an return the deleted count
  } catch (e) {
    ctx.logger.debug(e.message);
    throw new Error('An error occurred while deleting the locales');
  }
}

module.exports = { delete: _delete, deleteMany };
