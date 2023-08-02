const parseType = require('./parseType');

module.exports = function verifyOwnership({ type, ctx }) {
  const parsedType = parseType({ type, ctx });

  if (!(parsedType.calledFrom === ctx.callerPlugin || ctx.callerPlugin === 'common')) {
    return false;
  }

  return true;
};
