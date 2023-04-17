const { findOne: getTheme } = require('../theme');

async function getJsonTheme() {
  const theme = await getTheme();
  return theme?.tokens;
}

module.exports = getJsonTheme;
