const { listInstanceClasses } = require('../../../classes');

async function getTeacherPermission({ assignableInstance, ctx }) {
  const { userSession } = ctx.meta;
  const classes = (await listInstanceClasses({ id: assignableInstance, ctx })).map(
    ({ class: id }) => `plugins.academic-portfolio.class.${id}`
  );

  const permissions = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
    userAgent: userSession.userAgents,
    query: { permissionName: classes, actionName: 'edit' },
  });

  if (permissions.length) {
    return [
      {
        actionNames: ['view', 'edit'],
      },
    ];
  }

  return [];
}

module.exports = { getTeacherPermission };
