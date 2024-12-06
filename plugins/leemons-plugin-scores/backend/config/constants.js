const PLUGIN_NAME = 'scores';
const VERSION = 1;

const permissionNames = {
  periods: `${PLUGIN_NAME}.periods`,
  noteBook: `${PLUGIN_NAME}.notebook`,
  scores: `${PLUGIN_NAME}.scores`,
  scoresMenu: `${PLUGIN_NAME}.scoresMenu`,
  reviewer: `${PLUGIN_NAME}.reviewer`,
  weights: `${PLUGIN_NAME}.weights`,
};

const permissions = [
  {
    permissionName: permissionNames.periods,
    actions: ['view', 'create', 'update', 'delete', 'admin'],
    localizationName: {
      es: 'Periodos',
      en: 'Periods',
    },
  },
  {
    permissionName: permissionNames.noteBook,
    actions: ['view', 'create', 'update', 'delete', 'admin'],
    localizationName: {
      es: 'Cuaderno de evaluación',
      en: 'Evaluation notebook',
    },
  },
  {
    permissionName: permissionNames.scores,
    actions: ['view'],
    localizationName: {
      es: 'Mis Evaluaciones',
      en: 'My Evaluations',
    },
  },
  {
    permissionName: permissionNames.scoresMenu,
    actions: ['view'],
    localizationName: {
      es: 'Evaluaciones (menú)',
      en: 'Evaluations (menu)',
    },
  },
  {
    permissionName: permissionNames.reviewer,
    actions: ['view', 'admin'],
    localizationName: {
      es: 'Notas finales',
      en: 'Final grades',
    },
  },
  {
    permissionName: permissionNames.weights,
    actions: ['view', 'update', 'admin'],
    localizationName: {
      es: 'Ponderaciones',
      en: 'Weights',
    },
  },
];

/*
  --- Menu-Builder ---
*/
const menuItems = [
  {
    item: {
      key: 'scores',
      order: 203,
      iconSvg: '/public/scores/menu-icon.svg',
      activeIconSvg: '/public/scores/menu-icon.svg',
      label: {
        en: 'Evaluations',
        es: 'Evaluaciones',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.scoresMenu,
        actionNames: ['view'],
      },
    ],
  },
  {
    item: {
      key: 'scores.periods',
      order: 1,
      parentKey: 'scores.scores',
      url: '/private/scores/periods',
      label: {
        en: 'Periods',
        es: 'Periodos',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.periods,
        actionNames: ['create', 'update', 'delete', 'admin'],
      },
    ],
  },
  {
    item: {
      key: 'scores.notebook',
      order: 2,
      parentKey: 'scores.scores',
      url: '/private/scores/notebook',
      label: {
        en: 'Evaluation Notebook',
        es: 'Cuaderno de evaluación',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.noteBook,
        actionNames: ['view', 'admin'],
      },
    ],
  },
  {
    item: {
      key: 'scores.review',
      order: 3,
      parentKey: 'scores.scores',
      url: '/private/scores/notebook/review',
      label: {
        en: 'Final scores',
        es: 'Notas finales',
      },
    },
    permissions: [{ permissionName: permissionNames.reviewer, actionNames: ['view', 'admin'] }],
  },
  {
    item: {
      key: 'scores.scores',
      order: 4,
      parentKey: 'scores.scores',
      url: '/private/scores/scores',
      label: {
        en: 'Scores',
        es: 'Notas',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.scores,
        actionNames: ['view'],
      },
    ],
  },
  {
    item: {
      key: 'scores.weights',
      order: 5,
      parentKey: 'scores.scores',
      url: '/private/scores/weights',
      label: {
        en: 'Weighting rules',
        es: 'Reglas de ponderación',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.weights,
        actionNames: ['update', 'admin'],
      },
    ],
  },
];

module.exports = {
  PLUGIN_NAME,
  VERSION,

  permissionNames,
  permissions,

  menuItems,
};
