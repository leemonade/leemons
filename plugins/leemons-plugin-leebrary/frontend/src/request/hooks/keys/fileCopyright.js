export const allFileCopyrights = [
  {
    plugin: 'plugin.leebrary',
    scope: 'fileCopyright',
  },
];

export const allGetFileCopyright = [
  {
    ...allFileCopyrights[0],
    action: 'get',
  },
];

export const getFileCopyright = (id) => [
  {
    ...allGetFileCopyright[0],
    id,
  },
];
