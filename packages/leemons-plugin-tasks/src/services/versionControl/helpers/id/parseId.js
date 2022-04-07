const isValidVersion = require('../versions/isValidVersion');
const stringifyVersion = require('../versions/stringifyVersion');
const stringifyId = require('./stringifyId');

module.exports = async function parseId(
  fullId,
  _version,
  { verifyVersion = true, transacting } = {}
) {
  if (typeof fullId !== 'string') {
    throw new Error('Id must be a string');
  }

  const [uuid, version] = fullId.split('@');

  if (_version) {
    let v = _version;
    if (typeof v !== 'string') {
      try {
        v = stringifyVersion(v);
      } catch (e) {
        if (verifyVersion) {
          throw e;
        }
      }
    } else if (verifyVersion && !isValidVersion(v)) {
      throw new Error(`Version ${v} is not a valid version`);
    }

    return { fullId: stringifyId(uuid, v, { verifyVersion }), version: v, uuid };
  }

  // TODO: If version is @last, get the latest version

  if (verifyVersion && !isValidVersion(version)) {
    throw new Error('The provided version must be valid');
  }

  return { fullId, uuid, version };
};
