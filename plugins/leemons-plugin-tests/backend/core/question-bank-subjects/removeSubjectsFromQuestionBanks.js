const _ = require('lodash');

async function removeSubjectsFromQuestionBanks({ questionBank, ctx }) {
  return ctx.tx.db.QuestionBankSubjects.deleteMany({
    questionBank: _.isArray(questionBank) ? questionBank : [questionBank],
  });
}

module.exports = { removeSubjectsFromQuestionBanks };
