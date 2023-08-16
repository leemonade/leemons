const _ = require('lodash');
const { getCanEditProfiles } = require('./getCanEditProfiles');
const { isCanEditCurriculumInsidePermissions } = require('./isCanEditCurriculumInsidePermissions');
const { setCanEditProfiles } = require('./setCanEditProfiles');
const {
  updateAllNodeLevelFormsPermissions,
} = require('../nodeLevels/updateAllNodeLevelFormsPermissions');

async function onProfilePermissionsChange({ profile, permissions, ctx }) {
  const currentProfiles = await getCanEditProfiles({ ctx });
  const canEdit = isCanEditCurriculumInsidePermissions(permissions);
  if (canEdit) {
    currentProfiles.push(profile.id);
  } else {
    const index = currentProfiles.indexOf(profile.id);
    if (index !== -1) {
      currentProfiles.splice(index, 1);
    }
  }

  await setCanEditProfiles({ profiles: _.uniq(currentProfiles), ctx });
  await updateAllNodeLevelFormsPermissions({ ctx });
}

module.exports = { onProfilePermissionsChange };
