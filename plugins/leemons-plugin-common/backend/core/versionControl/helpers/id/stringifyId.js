const { LeemonsError } = require('leemons-error');
const { isValidVersion } = require('../versions');
const stringifyVersion = require('../versions/stringifyVersion');

module.exports = function stringifyId({ id, version: _version, verifyVersion = true, ctx }) {
  let version = _version;
  if (typeof _version !== 'string') {
    try {
      version = stringifyVersion({ ..._version, ctx });
    } catch (e) {
      if (verifyVersion) {
        throw e;
      }
    }
  } else if (verifyVersion && !isValidVersion(_version)) {
    throw new LeemonsError(ctx, { message: 'The provided version must be valid' });
  }

  return `${id}@${version}`;
};
