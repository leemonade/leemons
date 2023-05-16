const table = {
  config: leemons.query('plugins_users::config'),

  users: leemons.query('plugins_users::users'),
  userAgent: leemons.query('plugins_users::user-agent'),
  userRecoverPassword: leemons.query('plugins_users::user-recover-password'),
  userAgentPermission: leemons.query('plugins_users::user-agent-permission'),
  superAdminUser: leemons.query('plugins_users::super-admin-user'),

  groupUserAgent: leemons.query('plugins_users::group-user-agent'),
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
  centerLimits: leemons.query('plugins_users::center-limits'),
  userRememberLogin: leemons.query('plugins_users::user-remember-login'),

  userProfile: leemons.query('plugins_users::user-profile'),
  userAgentContacts: leemons.query('plugins_users::user-agent-contacts'),

  profileContacts: leemons.query('plugins_users::profile-contacts'),
  userRegisterPassword: leemons.query('plugins_users::user-register-password'),
  userPreferences: leemons.query('plugins_users::user-preferences'),
};

module.exports = { table };
