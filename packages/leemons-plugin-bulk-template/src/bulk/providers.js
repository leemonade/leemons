const path = require('path');
const itemsImport = require('./helpers/simpleListImport');

async function importProviders() {
  const filePath = path.resolve(__dirname, 'data.xlsx');
  const items = await itemsImport(filePath, 'providers', 10);

  // console.dir(items, { depth: null });
  return items;
}

module.exports = importProviders;
