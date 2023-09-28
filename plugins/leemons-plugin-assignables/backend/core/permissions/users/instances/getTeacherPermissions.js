async function getTeacherPermissions({ instances, ctx }) {
  const { userSession } = ctx.meta;

  const classes = await ctx.tx.db.Classes.find({
    assignableInstance_$in: instances,
  })
    .select(['assignableInstance', 'class'])
    .lean();

  const classesPerInstance = {};
  const classesPermissionNames = [];

  classes.forEach((klass) => {
    if (!classesPerInstance[klass.assignableInstance]) {
      classesPerInstance[klass.assignableInstance] = [klass.class];
    } else {
      classesPerInstance[klass.assignableInstance].push(klass.class);
    }

    classesPermissionNames.push(`academic-portfolio.class.${klass.class}`);
  });

  const permissions = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
    userAgent: userSession.userAgents,
    query: { permissionName: classesPermissionNames, actionName: 'edit' },
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
    instances.map((instance) => {
      const classesInInstance = classesPerInstance[instance];

      return [instance, !!classesInInstance?.some((klass) => permissionsPerClass[klass]?.length)];
    })
  );
}

module.exports = { getTeacherPermissions };
