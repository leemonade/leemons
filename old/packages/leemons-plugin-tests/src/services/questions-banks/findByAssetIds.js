const _ = require('lodash');
const { table } = require('../tables');
const { getQuestionsBanksDetails } = require('./getQuestionsBanksDetails');

async function findByAssetIds(ids, { userSession, transacting } = {}) {
  const questionsBanks = await table.questionsBanks.find(
    {
      asset_$in: ids,
      deleted_$null: false,
    },
    { transacting }
  );
  return getQuestionsBanksDetails(_.map(questionsBanks, 'id'), {
    userSession,
    transacting,
    getAssets: false,
  });
}

module.exports = { findByAssetIds };
