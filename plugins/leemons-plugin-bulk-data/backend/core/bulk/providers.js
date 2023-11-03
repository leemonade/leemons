const itemsImport = require('./helpers/simpleListImport');

async function importProviders(filePath) {
  return itemsImport(filePath, 'providers', 20);
}

module.exports = importProviders;
