const fs = require('fs');

function getJsonTheme() {
  if (!fs.existsSync('./config/tokens/tokens-compiled.json')) return {};
  const jsonTheme = JSON.parse(fs.readFileSync('./config/tokens/tokens-compiled.json'));
  return jsonTheme;
}

module.exports = getJsonTheme;
