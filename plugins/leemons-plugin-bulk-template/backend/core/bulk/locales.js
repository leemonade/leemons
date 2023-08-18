const itemsImport = require('./helpers/simpleListImport');

async function importLocales(filePath) {
  const items = await itemsImport(filePath, 'locales', 10);

  // console.dir(items, { depth: null });
  return items;
}

module.exports = importLocales;
