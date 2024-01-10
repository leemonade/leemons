export const allAssetsKey = [
  {
    plugin: 'plugin.leebrary',
    scope: 'assets',
  },
];

export const getAssetsKey = (ids, filters) => [
  {
    ...allAssetsKey[0],
    action: 'get',
    ids,
    filters,
  },
];
