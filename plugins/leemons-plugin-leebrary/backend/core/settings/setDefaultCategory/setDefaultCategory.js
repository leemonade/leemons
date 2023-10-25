const { set: updateSettings } = require('../set');

/**
 * This function sets the default category for the settings.
 *
 * @param {Object} params - An object containing the category ID and context.
 * @param {string} params.categoryId - The ID of the category to be set as default.
 * @param {MoleculerContext} params.ctx - The context object.
 * @returns {Promise} Returns a promise that resolves with the updated settings.
 * @throws {Error} If the function is not called from 'leemons-plugin-leebrary'.
 */
async function setDefaultCategory({ categoryId, ctx }) {
  if (ctx.callerPlugin !== 'leebrary') {
    throw new Error('Must be called from leemons-plugin-leebrary');
  }

  return updateSettings({ settings: { defaultCategory: categoryId }, ctx });
}

module.exports = { setDefaultCategory };
