export const allClassPublicDataManyKeys = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'class-public-data-many',
  },
];

// ids should be an array in all cases
export const getClassPublicDataManyKey = (ids) => [
  {
    ...allClassPublicDataManyKeys[0],
    ids,
  },
];
