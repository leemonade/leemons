export const allCenterPrograms = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'center-programs',
  },
];

export const getCenterProgramsKey = (center, filters) => [
  {
    ...allCenterPrograms[0],
    center,
    ...filters,
  },
];
