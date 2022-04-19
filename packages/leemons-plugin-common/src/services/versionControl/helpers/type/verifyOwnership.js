const parseType = require('./parseType');

module.exports = function verifyOwnership(type, that) {
  const parsedType = parseType(type);

  if (!(parsedType.calledFrom === that.calledFrom || that.calledFrom === 'plugins.common')) {
    return false;
  }

  return true;
};
