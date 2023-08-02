const { LeemonsError } = require('leemons-error');

module.exports = function stringifyType({ calledFrom, type, ctx }) {
  if (type.includes('::')) {
    throw new LeemonsError(ctx, { message: 'Type cannot contain ::' });
  }
  return `${calledFrom}::${type}`;
};
