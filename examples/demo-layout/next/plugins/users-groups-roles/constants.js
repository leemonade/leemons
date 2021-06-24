const constants = {
  base: 'users-groups-roles',
  frontend: {
    login: 'users-groups-roles/public/login',
    reset: 'users-groups-roles/public/reset',
    recover: 'users-groups-roles/public/recover',
    register: 'users-groups-roles/public/register',
    authLogin: 'users-groups-roles/public/auth/login',
    authLogout: 'users-groups-roles/public/auth/logout',
    private: {
      users: {
        list: 'users-groups-roles/private/users/list',
      },
      profiles: {
        list: 'users-groups-roles/private/profiles/list',
        detail: 'users-groups-roles/private/profiles/detail',
      },
    },
  },
  backend: {
    users: {
      login: 'users-groups-roles/user/login',
      recover: 'users-groups-roles/user/recover',
      reset: 'users-groups-roles/user/reset',
      canReset: 'users-groups-roles/user/can/reset',
      list: 'users-groups-roles/user/list',
    },
    profiles: {
      list: 'users-groups-roles/profile/list',
      add: 'users-groups-roles/profile/add',
    },
    permissions: {
      list: 'users-groups-roles/permission/list',
    },
    actions: {
      list: 'users-groups-roles/action/list',
    },
  },
};

export default constants;
