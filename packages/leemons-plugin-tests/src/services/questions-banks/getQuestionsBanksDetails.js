/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { getByIds } = require('../questions');

async function getQuestionsBanksDetails(id, { userSession, transacting, getAssets = true } = {}) {
  // Check is userSession is provided
  if (getAssets && !userSession)
    throw new Error('User session is required (getQuestionsBanksDetails)');

  const tagsService = leemons.getPlugin('common').services.tags;
  const ids = _.isArray(id) ? id : [id];
  const questionsBanks = await table.questionsBanks.find(
    { $or: [{ id_$in: ids }, { asset_$in: ids }], deleted_$null: false },
    { transacting }
  );

  const questionBankIds = _.map(questionsBanks, 'id');
  const questionIds = await table.questions.find(
    { questionBank_$in: questionBankIds },
    {
      columns: ['id'],
      transacting,
    }
  );
  const [questions, questionBankSubjects, questionBankCategories] = await Promise.all([
    getByIds(_.map(questionIds, 'id'), { userSession, transacting }),
    table.questionBankSubjects.find({ questionBank_$in: questionBankIds }, { transacting }),
    table.questionBankCategories.find({ questionBank_$in: questionBankIds }, { transacting }),
  ]);

  const promises = [];
  if (questionsBanks.length) {
    promises.push(
      tagsService.getValuesTags(_.map(questionsBanks, 'id'), {
        type: 'plugins.tests.questionBanks',
        transacting,
      })
    );
    if (getAssets) {
      const assetService = leemons.getPlugin('leebrary').services.assets;
      promises.push(
        assetService.getByIds(_.map(questionsBanks, 'asset'), {
          withFiles: true,
          userSession,
          transacting,
        })
      );
    } else {
      promises.push(Promise.resolve([]));
    }
  } else {
    promises.push(Promise.resolve([]));
    promises.push(Promise.resolve([]));
  }

  const [questionBanksTags, questionBanksAssets] = await Promise.all(promises);

  _.forEach(questionsBanks, (questionBank, i) => {
    questionBank.tags = questionBanksTags[i];
    if (questionBanksAssets[i]) {
      questionBank.asset = questionBanksAssets[i];
      questionBank.tagline = questionBanksAssets[i].tagline;
      questionBank.description = questionBanksAssets[i].description;
      questionBank.color = questionBanksAssets[i].color;
      questionBank.file = questionBanksAssets[i].file;
      questionBank.tags = questionBanksAssets[i].tags;
      questionBank.cover = questionBanksAssets[i].cover;
    }
  });

  const questionBankCategoriesByQuestionBank = _.groupBy(questionBankCategories, 'questionBank');
  const questionBankSubjectsByQuestionBank = _.groupBy(questionBankSubjects, 'questionBank');
  const questionsByQuestionBank = _.groupBy(questions, 'questionBank');
  const result = _.map(questionsBanks, (questionBank) => {
    const categories = _.orderBy(questionBankCategoriesByQuestionBank[questionBank.id], ['order']);
    const questionCategories = {};
    _.forEach(categories, (category, index) => {
      questionCategories[category.id] = index;
    });
    return {
      ...questionBank,
      categories: _.map(categories, (item) => ({
        value: item.category,
        id: item.id,
      })),
      subjects: _.map(questionBankSubjectsByQuestionBank[questionBank.id], 'subject'),
      questions: _.map(questionsByQuestionBank[questionBank.id] || [], (question) => ({
        ...question,
      })),
    };
  });
  // console.log(result);
  return result;
}

module.exports = { getQuestionsBanksDetails };
