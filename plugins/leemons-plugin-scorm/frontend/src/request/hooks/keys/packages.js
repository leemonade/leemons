export const allPackagesKeys = [
  {
    plugin: 'plugin.scorm',
    scope: 'packages',
  },
];

export const getPackageKey = (id) => [
  {
    ...allPackagesKeys,
    action: 'get',
    id,
  },
];
