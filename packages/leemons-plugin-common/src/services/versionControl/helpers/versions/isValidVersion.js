const parseVersion = require('./parseVersion');
const stringifyVersion = require('./stringifyVersion');

module.exports = function isValidVersion(version) {
  try {
    if (typeof version === 'string') {
      parseVersion(version);
    } else {
      stringifyVersion(version);
    }

    return true;
  } catch (e) {
    return false;
  }
};
