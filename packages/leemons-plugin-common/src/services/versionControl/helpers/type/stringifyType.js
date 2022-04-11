module.exports = function stringifyType(calledFrom, type) {
  if (type.includes('::')) {
    throw new Error('Type cannot contain ::');
  }
  return `${calledFrom}::${type}`;
};
