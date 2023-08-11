const _ = require('lodash');
const { table } = require('../tables');
const { validateAddNodeLevels } = require('../../validations/forms');
const { nodeLevelsByCurriculum } = require('./nodeLevelsByCurriculum');

async function addNodeLevels(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddNodeLevels(data, { transacting });

      const curriculum = await table.curriculums.findOne(
        { id: data.curriculum },
        {
          columns: ['step'],
          transacting,
        }
      );

      if (curriculum.step === 1) {
        await table.curriculums.update({ id: data.curriculum }, { step: 2 }, { transacting });
      }

      const nodeLevels = await Promise.all(
        _.map(data.nodeLevels, (nodeLevel) =>
          table.nodeLevels.create({ curriculum: data.curriculum, ...nodeLevel }, { transacting })
        )
      );

      await Promise.all(
        _.map(nodeLevels, (nodeLevel) =>
          leemons.getPlugin('dataset').services.dataset.addLocation(
            {
              name: {
                en: `node-level-${nodeLevel.id}`,
              },
              locationName: `node-level-${nodeLevel.id}`,
              pluginName: 'plugins.curriculum',
            },
            { transacting }
          )
        )
      );

      return nodeLevelsByCurriculum(data.curriculum, { transacting });
    },
    table.nodeLevels,
    _transacting
  );
}

module.exports = { addNodeLevels };
