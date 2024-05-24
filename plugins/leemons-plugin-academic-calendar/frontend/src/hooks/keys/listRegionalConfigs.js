export const allListRegionalConfigsKeys = [
  {
    plugin: 'plugin.academic-calendar',
    scope: 'list-regional-configs',
  },
];

export const getListRegionalConfigsKey = (center) => [
  {
    ...allListRegionalConfigsKeys[0],
    center,
  },
];
