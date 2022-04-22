const _ = require('lodash');
const { table } = require('../tables');

async function addQuestionToTest(test, question, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      // Check if test is empty
      if (_.isEmpty(test)) {
        throw new Error('Test is empty');
      }
      // Check if question is empty
      if (_.isEmpty(question)) {
        throw new Error('Question is empty');
      }
      const tests = _.isArray(test) ? test : [test];
      const questions = _.isArray(question) ? question : [question];
      const promises = [];
      _.forEach(tests, (_test) => {
        _.forEach(questions, (_question, order) => {
          promises.push(
            table.questionsTests.create(
              {
                test: _test,
                question: _question,
                order,
              },
              { transacting }
            )
          );
        });
      });
      const results = await Promise.all(promises);
      return !_.isArray(test) && !_.isArray(question) ? results[0] : results;
    },
    table.tests,
    _transacting
  );
}

module.exports = { addQuestionToTest };
