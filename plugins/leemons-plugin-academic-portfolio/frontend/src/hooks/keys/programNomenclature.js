export const allProgramNomenclatureKeys = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'program-nomenclature',
  },
];

export const getProgramNomenclatureKey = (programId, allLocales, localeFilter) => [
  {
    ...allProgramNomenclatureKeys[0],
    programId,
    allLocales,
    localeFilter,
  },
];
