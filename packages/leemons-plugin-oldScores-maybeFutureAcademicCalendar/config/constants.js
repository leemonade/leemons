const pluginName = 'plugins.scores';

const permissions = [
  {
    permissionName: `${pluginName}.scores`,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Puntuaciones', en: 'Scores' },
  },
  {
    permissionName: `${pluginName}.scores-program-config`,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Puntuaciones - Configuración', en: 'Scores - Setup' },
  },
  {
    permissionName: `${pluginName}.scores-teacher`,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Puntuaciones - Profesor', en: 'Scores - Teacher' },
  },
  {
    permissionName: `${pluginName}.scores-student`,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Puntuaciones - Estudiante', en: 'Scores - Student' },
  },
  {
    permissionName: `${pluginName}.scores-review`,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Puntuaciones - Revisión', en: 'Scores - Review' },
  },
];

const menuItems = [
  {
    config: {
      key: 'scores',
      order: 14,
      iconSvg: '/public/assets/svgs/curriculum.svg',
      activeIconSvg: '/public/assets/svgs/curriculum.svg',
      label: {
        en: 'Scores',
        es: 'Puntuaciones',
      },
    },
    permissions: [
      {
        permissionName: `${pluginName}.scores`,
        actionNames: ['view', 'update', 'create', 'delete', 'admin'],
      },
    ],
  },
  {
    config: {
      key: 'scores-program-config',
      parentKey: `${pluginName}.scores`,
      url: '/private/scores/setup',
      label: {
        en: 'Scores setup',
        es: 'Configuración de puntuaciones',
      },
    },
    permissions: [
      {
        permissionName: `${pluginName}.scores-program-config`,
        actionNames: ['view', 'update', 'create', 'delete', 'admin'],
      },
    ],
  },
  {
    config: {
      key: 'scores-teacher',
      parentKey: `${pluginName}.scores`,
      url: '/private/scores/teacher',
      label: {
        en: 'Teacher Scores',
        es: 'Puntuaciones del profesor',
      },
    },
    permissions: [
      {
        permissionName: `${pluginName}.scores-teacher`,
        actionNames: ['view', 'update', 'create', 'delete', 'admin'],
      },
    ],
  },
  {
    config: {
      key: 'scores-student',
      parentKey: `${pluginName}.scores`,
      url: '/private/scores/student',
      label: {
        en: 'Student Scores',
        es: 'Puntuaciones del estudiante',
      },
    },
    permissions: [
      {
        permissionName: `${pluginName}.scores-student`,
        actionNames: ['view', 'update', 'create', 'delete', 'admin'],
      },
    ],
  },
  {
    config: {
      key: 'scores-review',
      parentKey: `${pluginName}.scores`,
      url: '/private/scores/review',
      label: {
        en: 'Review Scores',
        es: 'Revisar puntuaciones',
      },
    },
    permissions: [
      {
        permissionName: `${pluginName}.scores-review`,
        actionNames: ['view', 'update', 'create', 'delete', 'admin'],
      },
    ],
  },
];

module.exports = {
  pluginName,
  permissions,
  menuItems,
};
