const allUserDatasetsKey = [
  {
    plugin: 'plugin.users',
    scope: 'datasets',
  },
];

const getUserDatasetsKey = (userId) => [
  {
    ...allUserDatasetsKey[0],
    action: 'getUserDatasets',
    params: {
      userId,
    },
  },
];

const getUserAgentsDatasetsKey = (userAgentId) => [
  {
    ...allUserDatasetsKey[0],
    action: 'getUserAgentsDatasets',
    params: {
      userAgentId,
    },
  },
];

export { allUserDatasetsKey, getUserDatasetsKey, getUserAgentsDatasetsKey };
