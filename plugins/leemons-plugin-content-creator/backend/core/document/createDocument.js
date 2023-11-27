async function createDocument({ data, ctx }) {
  return ctx.tx.db.Documents.create({ ...data }).then((mongooseDoc) => mongooseDoc.toObject());
}

module.exports = createDocument;
