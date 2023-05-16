const _ = require('lodash');
const permission = require('../../permission');
const table = require('../../../../tables');
const getPermissionName = require('../getPermissionName');
const getRoleMatchingActions = require('../getRoleMatchingActions');
const getTeacherPermission = require('./getTeacherPermission');

module.exports = async function getUserPermissionMultiple(
  _assignableInstances,
  { userSession, transacting } = {}
) {
  const assignableInstances = _.isArray(_assignableInstances)
    ? _assignableInstances
    : [_assignableInstances];

  // Sacamos todos los permisos que tiene el usuario sobre los assignable instance
  const permissions = await permission.getUserAgentPermissions(userSession.userAgents, {
    query: {
      $or: _.map(assignableInstances, (assignableInstance) => ({
        permissionName_$contains: getPermissionName(assignableInstance),
      })),
    },
    transacting,
  });

  function getByPermissionNameContains(contains) {
    return _.filter(permissions, ({ permissionName }) => permissionName.indexOf(contains) >= 0);
  }

  // Comprobamos de los assignable instances a cuales no tenemos permiso y los almacenamos
  const instanceWithOutPermissions = [];
  _.forEach(assignableInstances, (assignableInstance) => {
    if (!getByPermissionNameContains(getPermissionName(assignableInstance)).length) {
      instanceWithOutPermissions.push(assignableInstance);
    }
  });

  // Si hay assignable instances a los que no tenemos permiso puede que seamos profesores
  if (instanceWithOutPermissions.length) {
    // Sacamos todas las clases relacionadas con dichos assignables instances
    const classes = await table.classes.find(
      { assignableInstance_$in: instanceWithOutPermissions },
      { transacting }
    );
    const classesByAssignableInstance = _.groupBy(classes, 'assignableInstance');
    // Buscamos si tenemos permiso de editar dichas clases para comprobar si somos profesor y de que clases
    const classesPermissions = await permission.getUserAgentPermissions(userSession.userAgents, {
      query: {
        permissionName_$in: _.map(
          classes,
          ({ class: id }) => `plugins.academic-portfolio.class.${id}`
        ),
        actionName: 'edit',
      },
      transacting,
    });

    // Para cada instancia a la que no teniamos permisos sacamos sus clases y comprobamos si tenemos permiso
    _.forEach(instanceWithOutPermissions, (assignableInstance) => {
      const _classes = classesByAssignableInstance[assignableInstance];
      const classesKeys = _.map(
        _classes,
        ({ class: id }) => `plugins.academic-portfolio.class.${id}`
      );
      const _permissions = _.filter(classesPermissions, ({ permissionName }) =>
        classesKeys.includes(permissionName)
      );
      if (_permissions.length) {
        // Si tenemos permiso simulamos que teniamos el permiso del assignable instance como view y edit
        permissions.push({
          permissionName: getPermissionName(assignableInstance),
          actionNames: ['view', 'edit'],
        });
      } else {
        // Si no tenemos permisos simulamos como que podemos verlo
        // TODO: Return no permissions (for the demo everything is public)
        permissions.push({
          permissionName: getPermissionName(assignableInstance),
          actionNames: ['view'],
        });
      }
    });
  }

  const result = [];
  _.forEach(assignableInstances, (assignableInstance) => {
    const perm = getByPermissionNameContains(getPermissionName(assignableInstance));
    result.push({
      role: getRoleMatchingActions(perm[0].actionNames),
      actions: perm[0].actionNames,
      assignableInstance,
    });
  });

  return result;
};
