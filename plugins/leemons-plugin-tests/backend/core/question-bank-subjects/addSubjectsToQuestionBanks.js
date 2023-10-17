const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');

async function addSubjectsToQuestionBanks({ subject, questionBank, ctx }) {
  // Check if test is empty
  if (_.isEmpty(questionBank)) {
    throw new LeemonsError(ctx, { message: 'QuestionBank is empty' });
  }
  // Check if question is empty
  if (_.isEmpty(subject)) {
    throw new LeemonsError(ctx, { message: 'Subject is empty' });
  }
  const questionBanks = _.isArray(questionBank) ? questionBank : [questionBank];
  const subjects = _.isArray(subject) ? subject : [subject];
  const promises = [];
  _.forEach(subjects, (_subject) => {
    _.forEach(questionBanks, (_questionBank) => {
      promises.push(
        ctx.tx.db.QuestionBankSubjects.create({
          subject: _subject,
          questionBank: _questionBank,
        }).then((r) => r.toObject())
      );
    });
  });
  const results = await Promise.all(promises);
  return !_.isArray(subject) && !_.isArray(questionBank) ? results[0] : results;
}

module.exports = { addSubjectsToQuestionBanks };
