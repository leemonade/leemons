const _ = require('lodash');
const { table } = require('../tables');
const { validateAddNodeLevels } = require('../../validations/forms');
const { nodeLevelsByCurriculum } = require('./nodeLevelsByCurriculum');

async function addNodeLevels(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddNodeLevels(data, { transacting });

      await Promise.all(
        _.map(data.nodeLevels, (nodeLevel) =>
          table.nodeLevels.create({ curriculum: data.curriculum, ...nodeLevel }, { transacting })
        )
      );

      return nodeLevelsByCurriculum(data.curriculum, { transacting });
    },
    table.nodeLevels,
    _transacting
  );
}

module.exports = { addNodeLevels };
