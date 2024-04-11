export const allGroupDetailKeys = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'group-detail',
  },
];

export const getGroupDetailKey = (id) => [
  {
    ...allGroupDetailKeys,
    id,
  },
];
