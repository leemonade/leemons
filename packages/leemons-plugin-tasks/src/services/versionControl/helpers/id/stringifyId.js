const parseVersion = require('../versions/parseVersion');
const stringifyVersion = require('../versions/stringifyVersion');

module.exports = function stringifyId(id, _version) {
  let version;
  if (typeof id !== 'string') {
    version = stringifyVersion(_version);
  } else {
    // EN: Verify version format
    // ES: Verificar formato de versión
    parseVersion(_version);
  }

  return `${id}@${version}`;
};
