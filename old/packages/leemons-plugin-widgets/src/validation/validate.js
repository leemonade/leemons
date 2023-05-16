function validatePrefix(type, calledFrom) {
  if (!type.startsWith(calledFrom)) throw new Error(`The key must begin with ${calledFrom}`);
}

module.exports = { validatePrefix };
