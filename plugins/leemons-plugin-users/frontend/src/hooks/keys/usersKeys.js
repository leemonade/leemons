const allUsersKey = [
  {
    plugin: 'plugin.users',
    scope: 'users',
  },
];

const getUserListKey = (params) => [
  {
    ...allUsersKey[0],
    action: 'getUserList',
    params,
  },
];

export { allUsersKey, getUserListKey };
