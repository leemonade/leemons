const itemsImport = require('./helpers/simpleListImport');

async function importPlatform(filePath) {
  return itemsImport(filePath, 'platform', 10);
}

module.exports = importPlatform;
