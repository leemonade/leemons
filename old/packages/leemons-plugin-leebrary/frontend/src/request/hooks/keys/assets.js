export const allAssetsKey = [
  {
    plugin: 'plugin.leebrary',
    scope: 'assets',
  },
];

export const getAssetsKey = (ids, filters) => [
  {
    ...allAssetsKey,
    action: 'get',
    ids,
    filters,
  },
];
