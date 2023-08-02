const { LeemonsError } = require('leemons-error');

module.exports = function stringifyVersion({ major, minor, patch, ctx }) {
  if (typeof major !== 'number' || typeof minor !== 'number' || typeof patch !== 'number') {
    throw new LeemonsError(ctx, {
      message: 'Version must be an object with major, minor, and patch numeric properties',
    });
  }

  if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
    throw new LeemonsError(ctx, {
      message: 'Version must be an object with major, minor, and patch numeric non-NaN properties',
    });
  }

  return `${major}.${minor}.${patch}`;
};
