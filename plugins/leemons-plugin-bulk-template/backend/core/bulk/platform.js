const itemsImport = require('./helpers/simpleListImport');

async function importPlatform(filePath) {
  const items = await itemsImport(filePath, 'platform', 10);

  // console.dir(items, { depth: null });
  return items;
}

module.exports = importPlatform;
