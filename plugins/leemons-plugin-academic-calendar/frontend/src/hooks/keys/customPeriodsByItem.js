export const allCustomPeriodsByItemKeys = [
  {
    plugin: 'plugin.academic-calendar',
    scope: 'custom-period',
  },
];

export const getCustomPeriodsByItemKey = (item) => [
  {
    ...allCustomPeriodsByItemKeys[0],
    action: 'getByItem',
    item,
  },
];
