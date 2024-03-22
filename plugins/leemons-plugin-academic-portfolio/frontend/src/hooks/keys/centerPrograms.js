export const allCenterPrograms = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'center-programs',
  },
];

export const getCenterProgramsKey = (center, filters) => [
  {
    ...allCenterPrograms,
    center,
    ...filters,
  },
];
