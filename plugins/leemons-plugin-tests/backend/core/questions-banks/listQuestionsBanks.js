const _ = require('lodash');
const { mongoDBPaginate } = require('leemons-mongodb-helpers');

async function listQuestionsBanks({ page, size, subjects, published, query = {}, ctx }) {
  const versions = await ctx.tx.call('common.versionControl.listVersionsOfType', {
    type: 'question-bank',
    published,
  });
  let ids = _.map(versions, 'fullId');
  if (subjects && subjects.length) {
    const questionBankSubjects = await ctx.tx.db.QuestionBankSubjects.find({
      subject: subjects,
      questionBank: ids,
    }).lean();
    ids = _.uniq(_.map(questionBankSubjects, 'questionBank'));
  }
  const paginate = await mongoDBPaginate({
    model: ctx.tx.db.QuestionsBanks,
    page,
    size,
    query: { ...query, id: ids },
  });
  const questions = await ctx.tx.db.Questions.find({ questionBank: _.map(paginate.items, 'id') })
    .select(['id', 'questionBank'])
    .lean();
  const questionsByBank = _.groupBy(questions, 'questionBank');
  return {
    ...paginate,
    items: _.map(paginate.items, (item) => ({
      ...item,
      nQuestions: questionsByBank[item.id]?.length || 0,
    })),
  };
}

module.exports = { listQuestionsBanks };
