export const allInstancesKey = [
  {
    plugin: 'plugin.assignables',
    scope: 'instances',
  },
];

export const allInstancesGetKey = [
  {
    ...allInstancesKey[0],
    action: 'get',
  },
];

export const instancesGetKey = (filters) => [
  {
    ...allInstancesGetKey[0],

    ...filters,
  },
];

export const searchInstancesKey = (filters) => [
  {
    ...allInstancesKey[0],
    action: 'search',
    ...filters,
  },
];
