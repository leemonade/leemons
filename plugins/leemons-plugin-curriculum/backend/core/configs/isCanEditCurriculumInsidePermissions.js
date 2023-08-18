const _ = require('lodash');

function isCanEditCurriculumInsidePermissions(permissions) {
  const permissionsByName = _.keyBy(permissions, 'permissionName');
  const permission = permissionsByName['plugins.curriculum.curriculum'];
  return (
    permission &&
    permission.actionNames.some((e) => ['update', 'create', 'delete', 'admin'].indexOf(e) >= 0)
  );
}

module.exports = { isCanEditCurriculumInsidePermissions };
