const parseType = require('./parseType');

module.exports = function verifyOwnership(type, that) {
  const parsedType = parseType(type);

  if (parsedType.calledFrom !== that.calledFrom) {
    return false;
  }

  return true;
};
