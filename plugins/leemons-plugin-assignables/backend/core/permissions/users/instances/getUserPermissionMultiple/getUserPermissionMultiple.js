const _ = require('lodash');

const { getPermissionName } = require('../../../instances/helpers/getPermissionName');
const { getRoleMatchingActions } = require('../../../instances/helpers/getRoleMatchingActions');

async function getUserPermissionMultiple({ assignableInstances: _assignableInstances, ctx }) {
  const { userSession } = ctx.meta;

  const assignableInstances = _.isArray(_assignableInstances)
    ? _assignableInstances
    : [_assignableInstances];

  // Sacamos todos los permisos que tiene el usuario sobre los assignable instance
  const permissions = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
    userAgent: userSession.userAgents,
    query: {
      $or: _.map(assignableInstances, (assignableInstance) => ({
        permissionName: {
          $regex: getPermissionName({ assignableId: assignableInstance, ctx }),
          $options: 'i',
        },
      })),
    },
  });

  function getByPermissionNameContains(contains) {
    return _.filter(permissions, ({ permissionName }) => permissionName.indexOf(contains) >= 0);
  }

  // Comprobamos de los assignable instances a cuales no tenemos permiso y los almacenamos
  const instanceWithOutPermissions = [];
  _.forEach(assignableInstances, (assignableInstance) => {
    if (
      !getByPermissionNameContains(getPermissionName({ assignableId: assignableInstance, ctx }))
        .length
    ) {
      instanceWithOutPermissions.push(assignableInstance);
    }
  });

  // Si hay assignable instances a los que no tenemos permiso puede que seamos profesores
  if (instanceWithOutPermissions.length) {
    // Sacamos todas las clases relacionadas con dichos assignables instances
    const classes = await ctx.tx.db.Classes.find({
      assignableInstance: instanceWithOutPermissions,
    }).lean();
    const classesByAssignableInstance = _.groupBy(classes, 'assignableInstance');
    // Buscamos si tenemos permiso de editar dichas clases para comprobar si somos profesor y de que clases
    const classesPermissions = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
      userAgent: userSession.userAgents,
      query: {
        permissionName: _.map(classes, ({ class: id }) => `academic-portfolio.class.${id}`),
        actionName: 'edit',
      },
    });

    // Para cada instancia a la que no teniamos permisos sacamos sus clases y comprobamos si tenemos permiso
    _.forEach(instanceWithOutPermissions, (assignableInstance) => {
      const _classes = classesByAssignableInstance[assignableInstance];
      const classesKeys = _.map(_classes, ({ class: id }) => `academic-portfolio.class.${id}`);
      const _permissions = _.filter(classesPermissions, ({ permissionName }) =>
        classesKeys.includes(permissionName)
      );
      if (_permissions.length) {
        // Si tenemos permiso simulamos que teniamos el permiso del assignable instance como view y edit
        permissions.push({
          permissionName: getPermissionName({ assignableId: assignableInstance, ctx }),
          actionNames: ['view', 'edit'],
        });
      } else {
        // Si no tenemos permisos simulamos como que podemos verlo
        // TODO: Return no permissions (for the demo everything is public)
        permissions.push({
          permissionName: getPermissionName({ assignableId: assignableInstance, ctx }),
          actionNames: ['view'],
        });
      }
    });
  }

  const result = [];
  _.forEach(assignableInstances, (assignableInstance) => {
    const perm = getByPermissionNameContains(
      getPermissionName({ assignableId: assignableInstance, ctx })
    );
    result.push({
      role: getRoleMatchingActions({ actions: perm[0].actionNames }),
      actions: perm[0].actionNames,
      assignableInstance,
    });
  });

  return result;
}

module.exports = { getUserPermissionMultiple };
