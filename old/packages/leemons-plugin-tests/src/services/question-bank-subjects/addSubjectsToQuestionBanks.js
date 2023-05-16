const _ = require('lodash');
const { table } = require('../tables');

async function addSubjectsToQuestionBanks(
  subject,
  questionBank,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      // Check if test is empty
      if (_.isEmpty(questionBank)) {
        throw new Error('QuestionBank is empty');
      }
      // Check if question is empty
      if (_.isEmpty(subject)) {
        throw new Error('Subject is empty');
      }
      const questionBanks = _.isArray(questionBank) ? questionBank : [questionBank];
      const subjects = _.isArray(subject) ? subject : [subject];
      const promises = [];
      _.forEach(subjects, (_subject) => {
        _.forEach(questionBanks, (_questionBank) => {
          promises.push(
            table.questionBankSubjects.create(
              {
                subject: _subject,
                questionBank: _questionBank,
              },
              { transacting }
            )
          );
        });
      });
      const results = await Promise.all(promises);
      return !_.isArray(subject) && !_.isArray(questionBank) ? results[0] : results;
    },
    table.questionBankSubjects,
    _transacting
  );
}

module.exports = { addSubjectsToQuestionBanks };
