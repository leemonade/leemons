const _ = require('lodash');
const { getQuestionsBanksDetails } = require('./getQuestionsBanksDetails');

async function findByAssetIds({ ids, ctx }) {
  const questionsBanks = await ctx.tx.db.QuestionsBanks.find(
    {
      asset: ids,
    },
    undefined,
    { excludeDeleted: false }
  ).lean();
  return getQuestionsBanksDetails({ id: _.map(questionsBanks, 'id'), getAssets: false, ctx });
}

module.exports = { findByAssetIds };
