export const allAssignationsKey = [
  {
    plugin: 'plugin.assignables',
    scope: 'assignations',
  },
];

export const allAssignationsGetKey = [
  {
    ...allAssignationsKey[0],
    action: 'get',
  },
];

export const assignationsGetKey = (filters) => [
  {
    ...allAssignationsGetKey[0],

    ...filters,
  },
];
