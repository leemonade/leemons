const { isNil, isEmpty } = require('lodash');
/**
 * This function handles the creation of a new asset version.
 * It generates a new ID if not provided and returns it.
 *
 * @async
 * @param {Object} params - The parameters object.
 * @param {string} [params.newId ]- The new ID for the asset. If not provided, a new ID will be generated.
 * @param {string} params.categoryId - The ID of the category. This is used to prefix the new ID.
 * @param {boolean} [params.published] - Whether the asset is published. This is used in the version control registration.
 * @param {MoleculerContext} params.ctx - The moleculer ctx.
 * @returns {Promise<string>} The new ID of the asset.
 */
async function handleVersion({ newId, categoryId, published, ctx }) {
  if (isNil(newId) || isEmpty(newId)) {
    // ES: Añadimos el control de versiones
    // EN: Add version control
    const { fullId } = await ctx.tx.call('common.versionControl.register', {
      type: ctx.prefixPN(categoryId),
      published,
    })
    newId = fullId;
  }
  return newId;
}

module.exports = { handleVersion };

