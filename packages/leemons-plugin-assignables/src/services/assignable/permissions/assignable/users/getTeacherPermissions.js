const tables = require('../../../../tables');
const permission = require('../../permission');

module.exports = async function getTeacherPermissions(
  assignables,
  { userSession, transacting } = {}
) {
  const classes = await tables.classes.find(
    {
      assignable_$in: assignables,
    },
    { columns: ['assignable', 'class'], transacting }
  );

  const classesPerAssignable = {};
  const classesPermissionNames = [];

  classes.forEach((klass) => {
    if (!classesPerAssignable[klass.assignable]) {
      classesPerAssignable[klass.assignable] = [klass.class];
    } else {
      classesPerAssignable[klass.assignable].push(klass.class);
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
    assignables.map((assignable) => {
      const classesInAssignable = classesPerAssignable[assignable];

      return [
        assignable,
        !!classesInAssignable?.some((klass) => permissionsPerClass[klass]?.length),
      ];
    })
  );
};
