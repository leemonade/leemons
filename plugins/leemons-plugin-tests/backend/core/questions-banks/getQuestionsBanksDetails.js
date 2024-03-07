/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getByIds } = require('../questions');

async function getQuestionsBanksDetails({ id, getAssets = true, ctx }) {
  const { userSession } = ctx.meta;
  // Check is userSession is provided
  if (getAssets && !userSession)
    throw new LeemonsError(ctx, { message: 'User session is required (getQuestionsBanksDetails)' });

  const ids = _.isArray(id) ? id : [id];
  const questionsBanks = await ctx.tx.db.QuestionsBanks.find(
    { $or: [{ id: ids }, { asset: ids }] },
    undefined,
    { excludeDeleted: false }
  ).lean();

  const questionBankIds = _.map(questionsBanks, 'id');
  const questionIds = await ctx.tx.db.Questions.find({ questionBank: questionBankIds })
    .select(['id'])
    .lean();
  const [questions, questionBankSubjects, questionBankCategories] = await Promise.all([
    getByIds({ id: _.map(questionIds, 'id'), ctx }),
    ctx.tx.db.QuestionBankSubjects.find({ questionBank: questionBankIds }).lean(),
    ctx.tx.db.QuestionBankCategories.find({ questionBank: questionBankIds }).lean(),
  ]);

  const promises = [];
  if (questionsBanks.length) {
    promises.push(
      ctx.tx.call('common.tags.getValuesTags', {
        type: 'tests.questionBanks',
        values: _.map(questionsBanks, 'id'),
      })
    );

    if (getAssets) {
      promises.push(
        ctx.tx.call('leebrary.assets.getByIds', {
          ids: _.map(questionsBanks, 'asset'),
          withFiles: true,
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
