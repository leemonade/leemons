module.exports = {
  mainMenuKey: 'plugins.menu-builder.main',
  CORE_PLUGINS: [
    'leebrary',
    'grades',
    'academic-portfolio',
    'scores',
    'curriculum',
    'tasks',
    'tests',
    'families',
    'dashboard',
    'users',
    'calendar',
    'assignables',
  ].map((item) => `plugins.${item}`),
  url: {
    base: 'menu-builder',
    frontend: {},
    backend: {},
  },
};
