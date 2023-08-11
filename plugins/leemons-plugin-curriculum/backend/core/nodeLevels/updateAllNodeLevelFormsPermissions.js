const _ = require('lodash');
const { table } = require('../tables');
const { getCanEditProfiles } = require('../configs/getCanEditProfiles');
const { updateNodeLevelFormPermissions } = require('./updateNodeLevelFormPermissions');

async function updateAllNodeLevelFormsPermissions({ transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const [profiles, nodeLevels] = await Promise.all([
        getCanEditProfiles({ transacting }),
        table.nodeLevels.find({}, { columns: ['id'], transacting }),
      ]);
      if (_.isArray(profiles) && profiles.length) {
        await Promise.all(
          _.map(nodeLevels, (nodeLevel) =>
            updateNodeLevelFormPermissions(nodeLevel.id, { profiles, transacting })
          )
        );
      }
    },
    table.nodeLevels,
    _transacting
  );
}

module.exports = { updateAllNodeLevelFormsPermissions };
