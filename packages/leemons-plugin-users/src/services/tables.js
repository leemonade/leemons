const table = {
  config: leemons.query('plugins_users::config'),

  users: leemons.query('plugins_users::users'),
  userAuth: leemons.query('plugins_users::user-auth'),
  userRecoverPassword: leemons.query('plugins_users::user-recover-password'),
  userAuthPermission: leemons.query('plugins_users::user-auth-permission'),
  superAdminUser: leemons.query('plugins_users::super-admin-user'),

  groupUserAuth: leemons.query('plugins_users::group-user-auth'),
  groupRole: leemons.query('plugins_users::group-role'),
  groups: leemons.query('plugins_users::groups'),

  itemPermissions: leemons.query('plugins_users::item-permissions'),
  permissions: leemons.query('plugins_users::permissions'),
  permissionAction: leemons.query('plugins_users::permission-action'),

  roles: leemons.query('plugins_users::roles'),
  roleCenter: leemons.query('plugins_users::role-center'),
  rolePermission: leemons.query('plugins_users::role-permission'),

  actions: leemons.query('plugins_users::actions'),

  profiles: leemons.query('plugins_users::profiles'),
  profileRole: leemons.query('plugins_users::profile-role'),

  centers: leemons.query('plugins_users::centers'),
};

module.exports = { table };
