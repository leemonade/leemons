const { table } = require('../tables');

async function createDocument(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) =>
      table.documents.create(
        {
          ...data,
        },
        { transacting }
      ),
    table.documents,
    _transacting
  );
}

module.exports = createDocument;
