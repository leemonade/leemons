const allUserDatasetsKey = [
  {
    plugin: 'plugin.users',
    scope: 'datasets',
  },
];

const getUserDatasetsKey = (userAgentId) => [
  {
    ...allUserDatasetsKey[0],
    action: 'get',
    params: {
      userAgentId,
    },
  },
];

export { allUserDatasetsKey, getUserDatasetsKey };
