const table = {
  config: leemons.query('plugins_users-groups-roles::config'),

  users: leemons.query('plugins_users-groups-roles::users'),
  userAuth: leemons.query('plugins_users-groups-roles::user-auth'),
  userRecoverPassword: leemons.query('plugins_users-groups-roles::user-recover-password'),
  userAuthPermission: leemons.query('plugins_users-groups-roles::user-auth-permission'),
  userAuthRole: leemons.query('plugins_users-groups-roles::user-auth-role'),
  superAdminUser: leemons.query('plugins_users-groups-roles::super-admin-user'),

  groupUserAuth: leemons.query('plugins_users-groups-roles::group-user-auth'),
  groupRole: leemons.query('plugins_users-groups-roles::group-role'),
  groups: leemons.query('plugins_users-groups-roles::groups'),

  permissions: leemons.query('plugins_users-groups-roles::permissions'),
  permissionAction: leemons.query('plugins_users-groups-roles::permission-action'),

  roles: leemons.query('plugins_users-groups-roles::roles'),
  rolePermission: leemons.query('plugins_users-groups-roles::role-permission'),

  actions: leemons.query('plugins_users-groups-roles::actions'),
};

module.exports = { table };
