export const allLocalizationsKey = [
  {
    plugin: 'plugin.multilanguage',
    scope: 'localizations',
  },
];

export const localizationsGetKey = (filters) => [
  {
    ...allLocalizationsKey[0],

    ...filters,
  },
];
