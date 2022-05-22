/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { getQuestionsBanksDetails } = require('./getQuestionsBanksDetails');

async function deleteQuestionBank(id, { userSession, transacting } = {}) {
  const { versionControl } = leemons.getPlugin('common').services;
  const assetService = leemons.getPlugin('leebrary').services.assets;

  const version = await versionControl.getVersion(id, { transacting });
  const versions = (
    await versionControl.listVersions(id, {
      published: version.published,
      transacting,
    })
  ).map((v) => v.fullId);

  const questionBanks = await getQuestionsBanksDetails(versions, {
    userSession,
    getAssets: true,
    transacting,
  });

  const promises = [
    table.questionsBanks.deleteMany({ id_$in: versions }, { soft: true, transacting }),
  ];

  _.forEach(questionBanks, ({ asset }) => {
    promises.push(
      assetService.update(
        { ...asset, indexable: false },
        {
          userSession,
          transacting,
        }
      )
    );
  });

  await Promise.all(promises);

  return true;
}

module.exports = { deleteQuestionBank };
