const _ = require('lodash');
const { getCanEditProfiles } = require('./getCanEditProfiles');
const { isCanEditCurriculumInsidePermissions } = require('./isCanEditCurriculumInsidePermissions');
const { setCanEditProfiles } = require('./setCanEditProfiles');
const {
  updateAllNodeLevelFormsPermissions,
} = require('../nodeLevels/updateAllNodeLevelFormsPermissions');
const { table } = require('../tables');

async function onProfilePermissionsChange(
  { profile, permissions },
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const currentProfiles = await getCanEditProfiles({ transacting });
      const canEdit = isCanEditCurriculumInsidePermissions(permissions);
      if (canEdit) {
        currentProfiles.push(profile.id);
      } else {
        const index = currentProfiles.indexOf(profile.id);
        if (index !== -1) {
          currentProfiles.splice(index, 1);
        }
      }

      await setCanEditProfiles(_.uniq(currentProfiles), { transacting });
      await updateAllNodeLevelFormsPermissions({ transacting });
    },
    table.configs,
    _transacting
  );
}

module.exports = { onProfilePermissionsChange };
