export const allSimpleAssetListKey = [
  {
    plugin: 'plugin.leebrary',
    scope: 'simpleAssetList',
  },
];

export const getSimpleAssetListKey = (query) => [
  {
    ...allSimpleAssetListKey[0],
    action: 'get',
    query,
  },
];
