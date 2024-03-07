const _ = require('lodash');
const { validateAddNodeLevels } = require('../../validations/forms');
const { nodeLevelsByCurriculum } = require('./nodeLevelsByCurriculum');

async function addNodeLevels({ data, ctx }) {
  await validateAddNodeLevels({ data, ctx });

  const curriculum = await ctx.tx.db.Curriculums.findOne({ id: data.curriculum })
    .select(['step'])
    .lean();

  if (curriculum.step === 1) {
    await ctx.tx.db.Curriculums.updateOne({ id: data.curriculum }, { step: 2 });
  }

  const nodeLevels = await Promise.all(
    _.map(data.nodeLevels, (nodeLevel) =>
      ctx.tx.db.NodeLevels.create({ curriculum: data.curriculum, ...nodeLevel }).then((r) =>
        r.toObject()
      )
    )
  );

  await Promise.all(
    _.map(nodeLevels, (nodeLevel) =>
      ctx.tx.call('dataset.dataset.addLocation', {
        name: {
          en: `node-level-${nodeLevel.id}`,
        },
        locationName: `node-level-${nodeLevel.id}`,
        pluginName: 'curriculum',
      })
    )
  );

  return nodeLevelsByCurriculum({ ids: data.curriculum, ctx });
}

module.exports = { addNodeLevels };
