const _ = require('lodash');
const { LeemonsError } = require('leemons-error');

/**
 * Handles 'can use' data for an asset category.
 *
 * This function ensures that the caller is authorized to use the category by constructing a
 * list of plugins based on the given category. If the caller is not authorized,
 * it throws an error.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.ctx - The Moleculer context object. It should have a `prefixPN` function.
 * @param {string} params.calledFrom - The plugin or user that called this function.
 * @param {Object} params.category - The category object.
 * @returns {Array<string>} An array of users or plugins who are authorized to use the asset category.
 * @throws {LeemonsError} Throws an error if the caller is not authorized to use the category.
 */
function checkAndHandleCanUse({ category, calledFrom, ctx }) {
  let canUse = [ctx.prefixPN(''), category?.pluginOwner];
  if (_.isArray(category?.canUse) && category?.canUse.length) {
    canUse = canUse.concat(category.canUse);
  }

  if (category?.canUse !== '*' && !canUse.includes(calledFrom)) {
    throw new LeemonsError(ctx, {
      message: `Category "${category.key}" was not created by the "${calledFrom}" plugin. You can only add assets to categories created by the "${calledFrom}" plugin.`,
      httpStatusCode: 403,
    });
  }

  return canUse;
}

module.exports = { checkAndHandleCanUse };
