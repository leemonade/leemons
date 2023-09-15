const _ = require('lodash');

async function deleteCurriculum({ curriculumId, ctx }) {
  await ctx.tx.emit('before-remove-curriculum', {
    curriculum: curriculumId,
  });

  const nodeLevels = await ctx.tx.db.NodeLevels.find({ curriculum: curriculumId })
    .select(['id'])
    .lean();

  const promises = [];
  _.forEach(nodeLevels, (nodeLevel) => {
    promises.push(
      ctx.tx.call('dataset.dataset.deleteLocation', {
        locationName: `node-level-${nodeLevel.id}`,
        pluginName: 'curriculum',
        deleteValues: true,
      })
    );
  });

  await Promise.allSettled(promises);
  await Promise.all([
    ctx.tx.db.Nodes.deleteMany({ curriculum: curriculumId }),
    ctx.tx.db.NodeLevels.deleteMany({ curriculum: curriculumId }),
    ctx.tx.db.Curriculums.deleteOne({ id: curriculumId }),
  ]);

  await ctx.tx.emit('after-remove-curriculum', {
    curriculum: curriculumId,
  });
}

module.exports = { deleteCurriculum };
