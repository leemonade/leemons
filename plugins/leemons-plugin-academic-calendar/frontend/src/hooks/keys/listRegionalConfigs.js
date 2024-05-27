export const allListRegionalConfigsKeys = [
  {
    plugin: 'plugin.academic-calendar',
    scope: 'regional-config',
  },
];

export const getListRegionalConfigsKey = (center) => [
  {
    ...allListRegionalConfigsKeys[0],
    action: 'list',
    center,
  },
];
