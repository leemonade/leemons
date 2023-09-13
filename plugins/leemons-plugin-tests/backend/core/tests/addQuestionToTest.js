const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');

async function addQuestionToTest({ test, question, ctx }) {
  // Check if test is empty
  if (_.isEmpty(test)) {
    throw new LeemonsError(ctx, { message: 'Test is empty' });
  }
  // Check if question is empty
  if (_.isEmpty(question)) {
    throw new LeemonsError(ctx, { message: 'Question is empty' });
  }
  const tests = _.isArray(test) ? test : [test];
  const questions = _.isArray(question) ? question : [question];
  const promises = [];
  _.forEach(tests, (_test) => {
    _.forEach(questions, (_question, order) => {
      promises.push(
        ctx.tx.db.QuestionsTests.create({
          test: _test,
          question: _question,
          order,
        }).then((r) => r.toObject())
      );
    });
  });
  const results = await Promise.all(promises);
  return !_.isArray(test) && !_.isArray(question) ? results[0] : results;
}

module.exports = { addQuestionToTest };
