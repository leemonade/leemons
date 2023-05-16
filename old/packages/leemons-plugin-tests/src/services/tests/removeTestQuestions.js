const { table } = require('../tables');

async function removeTestQuestions(testId, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => table.questionsTests.deleteMany({ test: testId }, { transacting }),
    table.tests,
    _transacting
  );
}

module.exports = { removeTestQuestions };
