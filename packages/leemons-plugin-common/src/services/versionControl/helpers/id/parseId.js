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

  // eslint-disable-next-line prefer-const
  let [uuid, version] = fullId.split('@');

  if (_version) {
    version = _version;
    if (typeof _version !== 'string') {
      try {
        version = stringifyVersion(_version);
      } catch (e) {
        if (verifyVersion) {
          throw e;
        }
      }
    }
  }

  // TODO: If version is @last, get the latest version
  if (verifyVersion) {
    if (['latest', 'current', 'published', 'draft'].includes(version)) {
      // eslint-disable-next-line global-require
      const getVersion = require('../../versions/getVersion');

      const { version: v } = await getVersion.bind({ calledFrom: 'plugins.common' })(uuid, {
        version,
        transacting,
      });

      version = v;
    }

    if (!isValidVersion(version)) {
      throw new Error('The provided version must be valid');
    }
  }

  return { fullId: await stringifyId(uuid, version, { verifyVersion }), uuid, version };
};
