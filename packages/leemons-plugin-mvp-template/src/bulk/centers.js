const path = require('path');
const itemsImport = require('./helpers/simpleListImport');

async function importCenters() {
  const filePath = path.resolve(__dirname, 'data.xlsx');
  const items = await itemsImport(filePath, 'centers', 10);

  // console.dir(items, { depth: null });
  return items;
}

module.exports = importCenters;
