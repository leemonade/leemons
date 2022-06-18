const { addLocales } = require('./src/services/locales/addLocales');

async function init() {
  await addLocales(['es', 'en']);
}

module.exports = init;
