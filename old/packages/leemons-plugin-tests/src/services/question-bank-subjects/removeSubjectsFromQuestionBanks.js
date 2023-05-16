const _ = require('lodash');
const { table } = require('../tables');

async function removeSubjectsFromQuestionBanks(questionBank, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) =>
      table.questionBankSubjects.deleteMany(
        { questionBank_$in: _.isArray(questionBank) ? questionBank : [questionBank] },
        { transacting }
      ),
    table.tests,
    _transacting
  );
}

module.exports = { removeSubjectsFromQuestionBanks };
