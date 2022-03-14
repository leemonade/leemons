function validateTypePrefix(type, calledFrom) {
  if (!type.startsWith(calledFrom)) throw new Error(`The type name must begin with ${calledFrom}`);
}

module.exports = { validateTypePrefix };
