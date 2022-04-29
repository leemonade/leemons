/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');

async function getQuestionsBanksDetails(id, { userSession, transacting, getAssets = true } = {}) {
  // Check is userSession is provided
  if (getAssets && !userSession)
    throw new Error('User session is required (getQuestionsBanksDetails)');

  const tagsService = leemons.getPlugin('common').services.tags;
  const ids = _.isArray(id) ? id : [id];
  const [questionsBanks, questions, questionBankSubjects, questionBankCategories] =
    await Promise.all([
      table.questionsBanks.find({ id_$in: ids }, { transacting }),
      table.questions.find({ questionBank_$in: ids }, { transacting }),
      table.questionBankSubjects.find({ questionBank_$in: ids }, { transacting }),
      table.questionBankCategories.find({ questionBank_$in: ids }, { transacting }),
    ]);

  _.forEach(questions, (question) => {
    question.properties = JSON.parse(question.properties);
  });

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

      const assetIds = [];
      _.forEach(questions, (question) => {
        if (question.properties?.image) {
          assetIds.push(question.properties.image);
        }
      });

      promises.push(
        assetService.getByIds(assetIds, {
          withFiles: true,
          userSession,
          transacting,
        })
      );
    } else {
      promises.push(Promise.resolve([]));
      promises.push(Promise.resolve([]));
    }
  } else {
    promises.push(Promise.resolve([]));
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

  const [questionBanksTags, questionBanksAssets, questionAssets, questionsTags] = await Promise.all(
    promises
  );

  _.forEach(questionsBanks, (questionBank, i) => {
    questionBank.tags = questionBanksTags[i];
    if (questionBanksAssets[i]) {
      questionBank.asset = questionBanksAssets[i];
      questionBank.tagline = questionBanksAssets[i].tagline;
      questionBank.summary = questionBanksAssets[i].description;
      questionBank.cover = questionBanksAssets[i];
    }
  });

  const questionAssetsById = _.keyBy(questionAssets, 'id');
  _.forEach(questions, (question, i) => {
    question.tags = questionsTags[i];
    if (question.properties?.image) {
      question.properties.image = questionAssetsById[question.properties.image];
    }
  });

  const questionBankCategoriesByQuestionBank = _.groupBy(questionBankCategories, 'questionBank');
  const questionBankSubjectsByQuestionBank = _.groupBy(questionBankSubjects, 'questionBank');
  const questionsByQuestionBank = _.groupBy(questions, 'questionBank');
  return _.map(questionsBanks, (questionBank) => {
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
}

module.exports = { getQuestionsBanksDetails };
