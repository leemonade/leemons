export const allAssignablesKey = [
  {
    plugin: 'plugin.assignables',
    scope: 'assignables',
  },
];

export const allAssignablesGetKey = [
  {
    ...allAssignablesKey[0],
    action: 'get',
  },
];

export const assignablesGetKey = (filters) => [
  {
    ...allAssignablesGetKey[0],

    ...filters,
  },
];
