export const allZonesKeys = [
  {
    plugin: 'plugin.widgets',
    scope: 'zones',
  },
];

export const getZoneKey = (id) => [
  {
    ...allZonesKeys[0],
    action: 'get',
    id,
  },
];
