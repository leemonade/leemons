const { LeemonsError } = require('@leemons/error');

module.exports = function parseVersion({ version, ctx }) {
  if (typeof version !== 'string') {
    throw new LeemonsError(ctx, { message: 'Version must be a string.' });
  }

  // eslint-disable-next-line no-unsafe-optional-chaining
  const [major, minor, patch] = version.split('.')?.map(Number);

  if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
    throw new LeemonsError(ctx, {
      message: 'Version must be a string of numbers separated by dots.',
    });
  }

  return { major, minor, patch };
};
