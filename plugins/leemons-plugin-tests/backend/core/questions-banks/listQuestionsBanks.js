const { mongoDBPaginate } = require('@leemons/mongodb-helpers');
const _ = require('lodash');

async function listQuestionsBanks({
  page,
  size,
  subjects,
  published,
  includeAgnosticsQB,
  withAssets,
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
  if (subjects?.length) {
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
  const paginatedResults = await mongoDBPaginate({
    model: ctx.tx.db.QuestionsBanks,
    page,
    size,
    query: finalQuery,
  });

  const qbanksIds = _.map(paginatedResults.items, 'id');
  const qbanksAssetsIds = _.map(paginatedResults.items, 'asset');

  const questions = await ctx.tx.db.Questions.find({ questionBank: qbanksIds })
    .select(['id', 'questionBank'])
    .lean();
  const questionsByBank = _.groupBy(questions, 'questionBank');

  // Retrieve assets from leebrary to check permissions
  const authorizedQuestionBankAssets = await ctx.tx.call('leebrary.assets.getByIds', {
    ids: qbanksAssetsIds,
    checkPermissions: true,
  });

  const assetsById = _.keyBy(authorizedQuestionBankAssets, 'id');
  const finalQuestionBanks = paginatedResults.items.filter((item) =>
    Object.keys(assetsById).includes(item.asset)
  );

  return {
    ...paginatedResults,
    items: _.map(finalQuestionBanks, (item) => ({
      ...item,
      nQuestions: questionsByBank[item.id]?.length || 0,
      asset: withAssets ? assetsById[item.asset] ?? item.asset : item.asset,
    })),
  };
}

module.exports = { listQuestionsBanks };
