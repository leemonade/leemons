const _ = require('lodash');
const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

async function listQuestionsBanks({
  page,
  size,
  subjects,
  published,
  includeAgnosticsQB,
  query = {},
  ctx,
}) {
  const versions = await ctx.tx.call('common.versionControl.list', {
    type: 'question-bank',
    published,
  });
  const allQBsIds = await Promise.all(
    _.map(versions, (version) =>
      ctx.tx.call('common.versionControl.stringifyId', {
        id: version.uuid,
        version: version.current,
        verifyVersion: false,
      })
    )
  );

  let ids = allQBsIds;
  if (subjects && subjects.length) {
    const questionBankSubjects = await ctx.tx.db.QuestionBankSubjects.find({
      subject: subjects,
      questionBank: ids,
    }).lean();
    ids = _.uniq(_.map(questionBankSubjects, 'questionBank'));
  }
  const finalQuery = {
    ...query,
    ...(includeAgnosticsQB
      ? {
          id: allQBsIds,
          $or: [{ id: ids }, { program: { $exists: false } }, { program: null }, { program: '' }],
        }
      : { id: ids }),
  };
  const paginate = await mongoDBPaginate({
    model: ctx.tx.db.QuestionsBanks,
    page,
    size,
    query: finalQuery,
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
