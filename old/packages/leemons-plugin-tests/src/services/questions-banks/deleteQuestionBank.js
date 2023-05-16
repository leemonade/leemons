/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { getQuestionsBanksDetails } = require('./getQuestionsBanksDetails');

async function deleteQuestionBank(_id, { userSession, transacting } = {}) {
  const { versionControl } = leemons.getPlugin('common').services;
  const assetService = leemons.getPlugin('leebrary').services.assets;

  const version = await versionControl.getVersion(_id, { transacting });
  const versions = (
    await versionControl.listVersions(_id, {
      published: version.published,
      transacting,
    })
  ).map((v) => v.fullId);

  const questionBanks = await getQuestionsBanksDetails(versions, {
    userSession,
    getAssets: true,
    transacting,
  });

  const promises = [];

  _.forEach(questionBanks, ({ id, asset }) => {
    promises.push(table.questionsBanks.delete({ id }, { soft: true, transacting }));
    promises.push(
      assetService.update(
        { id: asset.id, name: asset.name, category: asset.category, indexable: false },
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
