const _ = require('lodash');
const { getCanEditProfiles } = require('../configs/getCanEditProfiles');
const { updateNodeLevelFormPermissions } = require('./updateNodeLevelFormPermissions');

async function updateAllNodeLevelFormsPermissions({ ctx }) {
  const [profiles, nodeLevels] = await Promise.all([
    getCanEditProfiles({ ctx }),
    ctx.tx.db.NodeLevels.find({}).select(['id']).lean(),
  ]);
  if (_.isArray(profiles) && profiles.length) {
    await Promise.all(
      _.map(nodeLevels, (nodeLevel) =>
        updateNodeLevelFormPermissions({ nodeLevelId: nodeLevel.id, profiles, ctx })
      )
    );
  }
}

module.exports = { updateAllNodeLevelFormsPermissions };
