const { listAssignableClasses } = require('../../../../classes/listAssignableClasses');

async function getTeacherPermission({ assignableId, ctx }) {
  const classes = await listAssignableClasses({ id: assignableId, ctx });

  const classesIds = classes.map(({ class: id }) => `academic-portfolio.class.${id}`);

  const permissions = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
    query: { permissionName: classesIds, actionName: 'edit' },
    userAgent: ctx.meta.userSession.userAgents,
  });

  if (!permissions.length) {
    return [];
  }

  return [
    {
      actionNames: ['view', 'edit'],
    },
  ];
}

module.exports = {
  getTeacherPermission,
};
