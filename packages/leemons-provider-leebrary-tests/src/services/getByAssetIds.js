const _ = require('lodash');

async function getByAssetIds(assetIds, { userSession, transacting }) {
  const { questionsBanks } = leemons.getPlugin('tests').services;
  return questionsBanks.findByAssetIds(_.map(assetIds, 'id'), {
    userSession,
    transacting,
  });
}

module.exports = { getByAssetIds };
