const { LeemonsError } = require('@leemons/error');

const { getById } = require('../getById');

/**
 * Checks if a category is duplicable. If the category is not duplicable, it throws an HTTP error.
 *
 * @async
 * @function checkDuplicable
 * @param {Object} params - The main parameter object.
 * @param {string} params.categoryId - The ID of the category to check.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<object>} The category if it is duplicable.
 * @throws {LeemonsError} If the category is not duplicable, a LeemonsError is thrown.
 */
async function checkDuplicable({ categoryId, ctx }) {
  const category = await getById({ id: categoryId, ctx });
  if (!category?.duplicable) {
    throw new LeemonsError(ctx, {
      message: 'Assets in this category cannot be duplicated',
      httpStatusCode: 401,
    });
  }

  return category;
}

module.exports = { checkDuplicable };
