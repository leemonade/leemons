/**
 * Retrieves teacher permissions for a given set of assignable IDs.
 * @async
 * @function getTeacherPermissions
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.assignableIds - The IDs of the assignables.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @return {Promise<Object>} - A promise that resolves to an object mapping the assignable IDs to a boolean indicating whether the teacher has permissions for that assignable.
 */

async function getTeacherPermissions({ assignableIds, ctx }) {
  const classes = await ctx.tx.db.Classes.find({
    assignable: assignableIds,
  })
    .select({ assignable: true, class: true })
    .lean();

  const classesPerAssignable = {};
  const classesPermissionNames = [];

  classes.forEach((klass) => {
    if (!classesPerAssignable[klass.assignable]) {
      classesPerAssignable[klass.assignable] = [klass.class];
    } else {
      classesPerAssignable[klass.assignable].push(klass.class);
    }

    classesPermissionNames.push(`academic-portfolio.class.${klass.class}`);
  });

  const permissions = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
    userAgent: ctx.meta.userSession.userAgents,
    query: {
      permissionName: classesPermissionNames,
      actionName: 'edit',
    },
  });

  const permissionsPerClass = {};

  permissions.forEach((perm) => {
    // academic-portfolio.class. -> length = 25
    const klass = perm.permissionName.substring(25);

    // EN: If we have the edition permission, we can assume we have the view permission
    // ES: Si tenemos permisoss de edición, podemos asumir el de visualización
    permissionsPerClass[klass] = ['view', 'edit'];
  });

  return Object.fromEntries(
    assignableIds.map((assignable) => {
      const classesInAssignable = classesPerAssignable[assignable];

      return [
        assignable,
        !!classesInAssignable?.some((klass) => permissionsPerClass[klass]?.length),
      ];
    })
  );
}

module.exports = { getTeacherPermissions };
