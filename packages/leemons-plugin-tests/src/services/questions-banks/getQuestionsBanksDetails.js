/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');

async function getQuestionsBanksDetails(id, { transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  const ids = _.isArray(id) ? id : [id];
  const [questionsBanks, questions] = await Promise.all([
    table.questionsBanks.find({ id_$in: ids }, { transacting }),
    table.questions.find({ questionBank_$in: ids }, { transacting }),
  ]);

  const [questionBanksTags, questionsTags] = await Promise.all([
    tagsService.getValuesTags(_.map(questionsBanks, 'id'), {
      type: 'plugins.tests.questionBanks',
      transacting,
    }),
    tagsService.getValuesTags(_.map(questions, 'id'), {
      type: 'plugins.tests.questions',
      transacting,
    }),
  ]);

  _.forEach(questionsBanks, (questionBank, i) => {
    questionBank.tags = questionBanksTags[i];
  });
  _.forEach(questions, (question, i) => {
    question.tags = questionsTags[i];
  });

  const questionsByQuestionBank = _.groupBy(questions, 'questionBank');
  return _.map(questionsBanks, (questionBank) => ({
    ...questionBank,
    questions: questionsByQuestionBank[questionBank.id] || [],
  }));
}

module.exports = { getQuestionsBanksDetails };
