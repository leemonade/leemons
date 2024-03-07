/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { getQuestionsBanksDetails } = require('./getQuestionsBanksDetails');

async function deleteQuestionBank({ id: _id, ctx }) {
  const version = await ctx.tx.call('common.versionControl.getVersion', { id: _id });
  const versions = (
    await ctx.tx.call('common.versionControl.listVersions', {
      id: _id,
      published: version.published,
    })
  ).map((v) => v.fullId);

  const questionBanks = await getQuestionsBanksDetails({ id: versions, getAssets: true, ctx });

  const promises = [];

  _.forEach(questionBanks, ({ id, asset }) => {
    promises.push(ctx.tx.db.QuestionsBanks.deleteOne({ id }, { soft: true }));
    promises.push(
      ctx.tx.call('leebrary.assets.update', {
        data: { id: asset.id, name: asset.name, category: asset.category, indexable: false },
      })
    );
  });

  await Promise.all(promises);

  return true;
}

module.exports = { deleteQuestionBank };
