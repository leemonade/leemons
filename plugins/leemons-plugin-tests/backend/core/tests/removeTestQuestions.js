async function removeTestQuestions({ testId, ctx }) {
  return ctx.tx.db.QuestionsTests.deleteMany({ test: testId });
}

module.exports = { removeTestQuestions };
