const { ImporterFactory } = require('xlsx-import/lib/ImporterFactory');

function getXlsImporter() {
  return ImporterFactory;
}

module.exports = getXlsImporter;
