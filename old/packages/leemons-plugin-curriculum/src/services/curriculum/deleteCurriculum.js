const _ = require('lodash');
const { table } = require('../tables');

async function deleteCurriculum(curriculumId, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await leemons.events.emit('before-remove-curriculum', {
        curriculum: curriculumId,
        transacting,
      });

      const nodeLevels = await table.nodeLevels.find(
        { curriculum: curriculumId },
        {
          columns: ['id'],
          transacting,
        }
      );

      const promises = [];
      _.forEach(nodeLevels, (nodeLevel) => {
        promises.push(
          leemons
            .getPlugin('dataset')
            .services.dataset.deleteLocation(`node-level-${nodeLevel.id}`, 'plugins.curriculum', {
              deleteValues: true,
              transacting,
            })
        );
      });

      await Promise.allSettled(promises);
      await Promise.all([
        table.nodes.deleteMany({ curriculum: curriculumId }, { transacting }),
        table.nodeLevels.deleteMany({ curriculum: curriculumId }, { transacting }),
        table.curriculums.delete({ id: curriculumId }, { transacting }),
      ]);

      await leemons.events.emit('after-remove-curriculum', {
        curriculum: curriculumId,
        transacting,
      });
    },
    table.curriculums,
    _transacting
  );
}

module.exports = { deleteCurriculum };
