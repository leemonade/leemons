export const allSimpleAssetListKey = [
  {
    plugin: 'plugin.leebrary',
    scope: 'simpleAssetList',
  },
];

export const allGetSimpleAssetListKey = [
  {
    ...allSimpleAssetListKey[0],
    action: 'get',
  },
];

export const getSimpleAssetListKey = (query) => [
  {
    ...allGetSimpleAssetListKey[0],
    ...query,
  },
];
