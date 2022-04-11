module.exports = function parseType(type) {
  if (typeof type === 'string') {
    const [calledFrom, t] = type.split('::');

    return { calledFrom, type: t };
  }

  throw new Error('The type must be a string');
};
