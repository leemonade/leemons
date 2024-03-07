const parseVersion = require('./parseVersion');
const stringifyVersion = require('./stringifyVersion');

module.exports = function isValidVersion({ version, ctx }) {
  try {
    if (typeof version === 'string') {
      if (['latest', 'current', 'published', 'draft'].includes(version)) {
        return true;
      }
      parseVersion({ version, ctx });
    } else {
      stringifyVersion({ ...version, ctx });
    }

    return true;
  } catch (e) {
    return false;
  }
};
