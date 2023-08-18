function getXlsImporter() {
  if (global.utils) {
    const { XlsxImporter } = global.utils;
    return XlsxImporter;
  }

  // eslint-disable-next-line global-require
  const { ImporterFactory } = require('xlsx-import/lib/ImporterFactory');
  return ImporterFactory;
}

module.exports = getXlsImporter;
