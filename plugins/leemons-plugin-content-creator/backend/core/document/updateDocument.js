async function updateDocument({ documentId, data, ctx }) {
  return ctx.tx.db.Documents.findOneAndUpdate(
    { id: documentId },
    {
      ...data,
    },
    {
      lean: true,
      new: true,
    }
  );
}

module.exports = updateDocument;
