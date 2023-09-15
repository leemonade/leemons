const { isEmpty } = require('lodash');

const { LeemonsError } = require('@leemons/error');

const { getByKey } = require('../getByKey');

/**
 * Removes a category by its key. If the category has associated assets, it throws an HTTP error.
 *
 * @async
 * @function removeByKey
 * @param {Object} params - The main parameter object.
 * @param {string} params.categoryKey - The key of the category to remove.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<object>} The result of the deletion operation.
 * @throws {LeemonsError} If the category has associated assets, a LeemonsError is thrown.
 */
async function removeByKey({ categoryKey, ctx }) {
  if (isEmpty(categoryKey)) {
    throw new LeemonsError(ctx, { message: 'Category key is required.', httpStatusCode: 400 });
  }

  const category = await getByKey({ key: categoryKey, ctx });

  if (!category || isEmpty(category)) {
    throw new LeemonsError(ctx, { message: 'Category not found.', httpStatusCode: 400 });
  }

  // ES: Revisamos que no existan assets asociados a la categoría
  // EN: Check if there are assets associated with the category
  const assets = await ctx.tx.db.Assets.find({ category: category.id });

  if (!isEmpty(assets)) {
    throw new LeemonsError(ctx, { message: 'Category has assets.', httpStatusCode: 400 });
  }

  try {
    return ctx.tx.db.Categories.deleteMany({ key: categoryKey });
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to remove category: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { removeByKey };
