export const allListRegionalConfigsKeys = [
  {
    plugin: 'plugin.academic-calendar',
    scope: 'list',
  },
];

export const getListRegionalConfigsKey = (center) => [
  {
    ...allListRegionalConfigsKeys[0],
    center,
  },
];
