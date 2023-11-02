const itemsImport = require('./helpers/simpleListImport');

async function importLocales(filePath) {
  return itemsImport(filePath, 'locales', 10);
}

module.exports = importLocales;
