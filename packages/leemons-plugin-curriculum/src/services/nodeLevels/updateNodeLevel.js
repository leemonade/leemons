const _ = require('lodash');
const { table } = require('../tables');
const { validateUpdateNodeLevel } = require('../../validations/forms');
const { reloadNodeFullNamesForCurriculum } = require('../nodes/reloadNodeFullNamesForCurriculum');

async function addNodeLevels(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateNodeLevel(data, { transacting });

      const { id, ...rest } = data;

      const nodeLevel = await table.nodeLevels.update({ id }, rest, { transacting });

      await reloadNodeFullNamesForCurriculum(data.curriculum, { transacting });

      return nodeLevel;
    },
    table.nodeLevels,
    _transacting
  );
}

module.exports = { addNodeLevels };
