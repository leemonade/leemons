module.exports = {
  mainMenuKey: 'plugins.menu-builder.main',
  CORE_PLUGINS: [
    'admin',
    'dashboard',

    'users',
    'grades',
    'academic-portfolio',
    'academic-calendar',

    'calendar',
    'assignables',
    'scores',

    'curriculum',
    'tasks',
    'tests',
    'feedback',

    'leebrary',
    'families',
  ].map((item) => `plugins.${item}`),
  url: {
    base: 'menu-builder',
    frontend: {},
    backend: {},
  },
};
