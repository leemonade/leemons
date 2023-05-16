module.exports = (message, errorCode = 1) => {
  // eslint-disable-next-line no-console
  console.error(message);
  process.exit(errorCode);
};
