const tables = require('../../../../tables');
const permission = require('../../permission');

module.exports = async function getTeacherPermission(instances, { userSession, transacting } = {}) {
  const classes = await tables.classes.find(
    {
      assignableInstance_$in: instances,
    },
    { columns: ['assignableInstance', 'class'], transacting }
  );

  const classesPerInstance = {};
  const classesPermissionNames = [];

  classes.forEach((klass) => {
    if (!classesPerInstance[klass.assignableInstance]) {
      classesPerInstance[klass.assignableInstance] = [klass.class];
    } else {
      classesPerInstance[klass.assignableInstance].push(klass.class);
    }

    classesPermissionNames.push(`plugins.academic-portfolio.class.${klass.class}`);
  });

  const permissions = await permission.getUserAgentPermissions(userSession.userAgents, {
    query: { permissionName_$in: classesPermissionNames, actionName: 'edit' },
    transacting,
  });

  const permissionsPerClass = {};
  permissions.forEach((perm) => {
    // plugins.academic-portfolio.class. -> length = 33
    const klass = perm.permissionName.substring(33);

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
};
