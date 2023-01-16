const itemsImport = require('./helpers/simpleListImport');

async function importCenters(filePath) {
  const items = await itemsImport(filePath, 'centers', 10);

  // console.dir(items, { depth: null });
  return items;
}

module.exports = importCenters;
