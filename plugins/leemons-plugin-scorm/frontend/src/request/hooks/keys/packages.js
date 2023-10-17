export const allPackagesKey = [
  {
    plugin: 'plugin.scorm',
    scope: 'packages',
  },
];

export const getPackageKey = (id) => [
  {
    ...allPackagesKey,
    action: 'get',
    id,
  },
];
