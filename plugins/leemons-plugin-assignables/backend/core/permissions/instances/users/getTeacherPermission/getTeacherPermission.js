const { listInstanceClasses } = require('../../../../classes');

/**
 * Retrieves the teacher permission for a given assignable instance.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.assignableInstance - The ID of the assignable instance.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @return {Promise<Array>} The teacher permission for the assignable instance.
 */
async function getTeacherPermission({ assignableInstance, ctx }) {
  const { userSession } = ctx.meta;
  const classes = (await listInstanceClasses({ id: assignableInstance, ctx })).map(
    ({ class: id }) => `academic-portfolio.class.${id}`
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
