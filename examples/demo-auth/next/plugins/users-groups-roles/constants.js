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
      list: 'users-groups-roles/private/users/list',
    },
  },
  backend: {
    login: 'users-groups-roles/user/login',
    recover: 'users-groups-roles/user/recover',
    reset: 'users-groups-roles/user/reset',
    canReset: 'users-groups-roles/user/can/reset',
    list: 'users-groups-roles/user/list',
  },
};

export default constants;
