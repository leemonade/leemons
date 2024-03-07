async function updateCategory({ data, ctx }) {
  const { id, ...props } = data;
  return ctx.tx.db.QuestionBankCategories.findOneAndUpdate(
    { id },
    { ...props },
    { new: true, lean: true }
  );
}

module.exports = { updateCategory };
