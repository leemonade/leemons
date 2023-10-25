const { LeemonsError } = require('@leemons/error');
const { getAssignables } = require('../getAssignables');

/**
 * Fetches a single assignable based on the provided id and other parameters.
 * It constructs a query to find the assignable either by its id or asset id.
 * It then fetches the assignable from the database and maps its id and asset id.
 * If the assignable does not exist or the user does not have access to it, it throws a LeemonsError.
 *
 * @async
 * @function getAssignable
 * @param {Object} params - The main parameter object.
 * @param {string} params.id - The id of the assignable to fetch.
 * @param {Array<string>} params.columns - The columns to include in the result. Defaults to ['asset'].
 * @param {boolean} params.withFiles - Flag to include files in the result.
 * @param {boolean} params.showDeleted - Flag to include deleted assignables. Defaults to true.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<AssignablesAssignable>} The fetched assignable.
 * @throws {LeemonsError} If the assignable does not exist or the user does not have access to it, a LeemonsError is thrown.
 */

async function getAssignable({ id, columns = ['asset'], withFiles, showDeleted = true, ctx }) {
  try {
    const assignables = await getAssignables({
      ids: [id],
      columns,
      withFiles,
      showDeleted,
      ctx,
    });

    return assignables[0];
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `The assignable ${id} does not exist or you don't have access to it.`,
      httpStatusCode: 404,
      cause: e,
    });
  }
}

module.exports = { getAssignable };
