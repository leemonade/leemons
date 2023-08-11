const { table } = require('../tables');

async function updateDocument(documentId, data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) =>
      table.documents.set(
        { id: documentId },
        {
          ...data,
        },
        { transacting }
      ),
    table.documents,
    _transacting
  );
}

module.exports = updateDocument;
