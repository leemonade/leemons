const constants = {
  base: 'users',
  frontend: {
    login: 'users/public/login',
    reset: 'users/public/reset',
    recover: 'users/public/recover',
    register: 'users/public/register',
    authLogin: 'users/public/auth/login',
    authLogout: 'users/public/auth/logout',
    private: {
      users: {
        list: 'users/private/users/list',
        detail: 'users/private/users/detail',
      },
      profiles: {
        list: 'users/private/profiles/list',
        detail: 'users/private/profiles/detail',
      },
    },
  },
  backend: {
    users: {
      login: 'users/user/login',
      recover: 'users/user/recover',
      reset: 'users/user/reset',
      canReset: 'users/user/can/reset',
      list: 'users/user/list',
    },
    profiles: {
      list: 'users/profile/list',
      add: 'users/profile/add',
      detail: 'users/profile/detail/:uri',
      update: 'users/profile/update',
    },
    permissions: {
      list: 'users/permission/list',
    },
    actions: {
      list: 'users/action/list',
    },
  },
};

export default constants;
