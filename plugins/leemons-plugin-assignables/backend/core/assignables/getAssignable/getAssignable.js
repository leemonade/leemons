const { LeemonsError } = require('leemons-error');
const { getAssignables } = require('../getAssignables');

async function getAssignable({ id, columns = ['asset'], withFiles, showDeleted = true, ctx }) {
  try {
    const assignables = await getAssignables({ ids: [id], columns, withFiles, showDeleted, ctx });

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
