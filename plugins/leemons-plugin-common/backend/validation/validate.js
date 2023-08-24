const { LeemonsError } = require('leemons-error');

function validateTypePrefix({ type, calledFrom, ctx }) {
  if (typeof type !== 'string' || !type.startsWith(calledFrom)) {
    throw new LeemonsError(ctx, { message: `The type name must begin with ${calledFrom}` });
  }
}

module.exports = { validateTypePrefix };
