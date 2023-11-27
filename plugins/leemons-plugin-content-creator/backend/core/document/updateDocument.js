async function updateDocument({ documentId, data, ctx }) {
  return ctx.tx.db.Documents.findOneAndUpdate(
    { id: documentId },
    {
      ...data,
    },

    { upsert: true, new: true, lean: true }
  );
}

module.exports = updateDocument;
