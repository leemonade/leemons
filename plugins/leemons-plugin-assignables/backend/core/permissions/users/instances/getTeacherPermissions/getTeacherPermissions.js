/**
 * Retrieves the teacher permissions for the given instances and user context.
 *
 * @param {Object} params - The params object.
 * @param {Array} params.instances - The instances to retrieve permissions for.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @return {Object} - An object mapping instances to a boolean value indicating whether the teacher has permissions for any classes in that instance.
 */
async function getTeacherPermissions({ instances, ctx }) {
  const { userSession } = ctx.meta;

  const classes = await ctx.tx.db.Classes.find({
    assignableInstance: instances,
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
