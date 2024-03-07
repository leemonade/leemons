const { LeemonsError } = require('@leemons/error');

function validatePrefix({ type, calledFrom, ctx }) {
  if (!type.startsWith(calledFrom))
    throw new LeemonsError(ctx, { message: `The key must begin with ${calledFrom}` });
}

module.exports = { validatePrefix };
