async function createCategory({ data, ctx }) {
  return ctx.tx.db.QuestionBankCategories.create({
    ...data,
  }).then((r) => r.toObject());
}

module.exports = { createCategory };
