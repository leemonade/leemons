const { listAssignableClasses } = require('../../../../classes');
const permission = require('../../permission');

module.exports = async function getTeacherPermission(
  assignable,
  { userSession, transacting } = {}
) {
  const classes = (await listAssignableClasses(assignable, { userSession, transacting })).map(
    ({ class: id }) => `plugins.academic-portfolio.class.${id}`
  );

  const permissions = await permission.getUserAgentPermissions(userSession.userAgents, {
    query: { permissionName_$in: classes, actionName: 'edit' },
    transacting,
  });

  if (permissions.length) {
    return [
      {
        actionNames: ['view', 'edit'],
      },
    ];
  }

  return [];
};
