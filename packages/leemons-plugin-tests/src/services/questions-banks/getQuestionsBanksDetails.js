/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');

async function getQuestionsBanksDetails(id, { transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  const ids = _.isArray(id) ? id : [id];
  const [questionsBanks, questions, questionBankSubjects, questionBankCategories] =
    await Promise.all([
      table.questionsBanks.find({ id_$in: ids }, { transacting }),
      table.questions.find({ questionBank_$in: ids }, { transacting }),
      table.questionBankSubjects.find({ questionBank_$in: ids }, { transacting }),
      table.questionBankCategories.find({ questionBank_$in: ids }, { transacting }),
    ]);

  const promises = [];
  if (questionsBanks.length) {
    promises.push(
      tagsService.getValuesTags(_.map(questionsBanks, 'id'), {
        type: 'plugins.tests.questionBanks',
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

  _.forEach(questionsBanks, (questionBank, i) => {
    questionBank.tags = questionBanksTags[i];
  });
  _.forEach(questions, (question, i) => {
    question.tags = questionsTags[i];
  });

  const questionBankCategoriesByQuestionBank = _.groupBy(questionBankCategories, 'questionBank');
  const questionBankSubjectsByQuestionBank = _.groupBy(questionBankSubjects, 'questionBank');
  const questionsByQuestionBank = _.groupBy(questions, 'questionBank');
  return _.map(questionsBanks, (questionBank) => ({
    ...questionBank,
    categories: _.map(
      _.orderBy(questionBankCategoriesByQuestionBank[questionBank.id], ['order']),
      (item) => ({
        value: item.category,
        id: item.id,
      })
    ),
    subjects: _.map(questionBankSubjectsByQuestionBank[questionBank.id], 'subject'),
    questions: _.map(questionsByQuestionBank[questionBank.id] || [], (question) => ({
      ...question,
      properties: JSON.parse(question.properties),
    })),
  }));
}

module.exports = { getQuestionsBanksDetails };
