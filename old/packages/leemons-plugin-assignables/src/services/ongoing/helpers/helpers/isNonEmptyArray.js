function isNonEmptyArray(value) {
  return Array.isArray(value) && value?.length > 0;
}

module.exports = { isNonEmptyArray };
