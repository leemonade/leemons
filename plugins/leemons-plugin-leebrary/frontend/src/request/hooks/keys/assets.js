export const allAssetsKey = [
  {
    plugin: 'plugin.leebrary',
    scope: 'assets',
  },
];

export const allGetAssetsKey = [
  {
    ...allAssetsKey[0],
    action: 'get',
  },
];

export const getAssetByFileKey = (fileId) => [
  {
    ...allAssetsKey[0],
    action: 'getAssetByFileKey',
    params: {
      fileId,
    },
  },
];

export const getAssetsKey = (ids, filters) => [
  {
    ...allGetAssetsKey[0],
    ids,
    filters,
  },
];
