const itemsImport = require('./helpers/simpleListImport');

async function importProviders(filePath) {
  const items = await itemsImport(filePath, 'providers', 20);

  // console.dir(items, { depth: null });
  return items;
}

module.exports = importProviders;
