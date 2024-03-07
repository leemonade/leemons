const itemsImport = require('./helpers/simpleListImport');

async function importCenters(filePath) {
  return itemsImport(filePath, 'centers', 10);
}

module.exports = importCenters;
