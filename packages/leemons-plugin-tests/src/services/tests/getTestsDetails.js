/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');

async function getTestsDetails(id, { transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  const ids = _.isArray(id) ? id : [id];
  const [tests, questionsTests] = await Promise.all([
    table.tests.find({ id_$in: ids }, { transacting }),
    table.questionsTests.find({ test_$in: ids }, { transacting }),
  ]);

  const questions = await table.questions.find(
    { id_$in: _.map(questionsTests, 'question') },
    { transacting }
  );

  const promises = [];
  if (tests.length) {
    promises.push(
      tagsService.getValuesTags(_.map(tests, 'id'), {
        type: 'plugins.tests.tests',
        transacting,
      })
    );
  } else {
    promises.push(Promise.resolve([]));
  }

  if (questions.length) {
    promises.push(
      tagsService.getValuesTags(_.map(questions, 'id'), {
        type: 'plugins.tests.questions',
        transacting,
      })
    );
  } else {
    promises.push(Promise.resolve([]));
  }

  const [questionBanksTags, questionsTags] = await Promise.all(promises);

  _.forEach(tests, (questionBank, i) => {
    questionBank.tags = questionBanksTags[i];
  });
  _.forEach(questions, (question, i) => {
    question.tags = questionsTags[i];
  });

  const questionsById = _.keyBy(questions, 'id');
  const questionsTestsByTest = _.groupBy(questionsTests, 'test');

  return _.map(tests, (test) => ({
    ...test,
    filters: JSON.parse(test.filters),
    questions: _.map(questionsTestsByTest[test.id] || [], (quest) => ({
      ...questionsById[quest.question],
      properties: JSON.parse(questionsById[quest.question].properties),
    })),
  }));
}

module.exports = { getTestsDetails };
