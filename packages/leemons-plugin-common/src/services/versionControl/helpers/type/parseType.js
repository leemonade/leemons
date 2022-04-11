module.exports = function parseType(type) {
  const [calledFrom, t] = type.split('.');

  return { calledFrom, type: t };
};
