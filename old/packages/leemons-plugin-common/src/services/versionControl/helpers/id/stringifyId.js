const { isValidVersion } = require('../versions');
const stringifyVersion = require('../versions/stringifyVersion');

module.exports = function stringifyId(id, _version, { verifyVersion = true } = {}) {
  let version = _version;
  if (typeof _version !== 'string') {
    try {
      version = stringifyVersion(_version);
    } catch (e) {
      if (verifyVersion) {
        throw e;
      }
    }
  } else if (verifyVersion && !isValidVersion(_version)) {
    throw new Error('The provided version must be valid');
  }

  return `${id}@${version}`;
};
