const { LeemonsError } = require('@leemons/error');

module.exports = function parseType({ type, ctx }) {
  if (typeof type === 'string') {
    const [calledFrom, t] = type.split('::');

    return { calledFrom, type: t };
  }

  throw new LeemonsError(ctx, { message: 'The type must be a string' });
};
