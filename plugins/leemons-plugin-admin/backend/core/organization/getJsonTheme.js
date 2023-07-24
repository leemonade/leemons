const { findOne: getTheme } = require('../theme');

async function getJsonTheme({ ctx }) {
  const theme = await getTheme({ ctx });
  return theme?.tokens;
}

module.exports = getJsonTheme;
