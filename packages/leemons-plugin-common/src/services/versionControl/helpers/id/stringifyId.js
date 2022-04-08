const parseVersion = require('../versions/parseVersion');
const stringifyVersion = require('../versions/stringifyVersion');

module.exports = function stringifyId(id, _version, { verifyVersion = true } = {}) {
  let version = _version;
  if (typeof id !== 'string') {
    try {
      version = stringifyVersion(_version);
    } catch (e) {
      if (verifyVersion) {
        throw e;
      }
    }
  } else if (verifyVersion) {
    // EN: Verify version format
    // ES: Verificar formato de versión
    parseVersion(_version);
  }

  return `${id}@${version}`;
};
