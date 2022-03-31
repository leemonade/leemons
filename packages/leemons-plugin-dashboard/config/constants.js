const pluginName = 'plugins.scores';

const permissions = [];

const menuItems = [
  {
    config: {
      key: 'dashboard',
      iconSvg: '/public/assets/svgs/plugin-dashboard.svg',
      activeIconSvg: '/public/assets/svgs/plugin-dashboard.svg',
      url: '/private/dashboard',
      label: {
        en: 'Dashboard',
        es: 'Dashboard',
      },
    },
  },
];

const widgets = {
  zones: [{ key: 'plugins.dashboard.program.left' }, { key: 'plugins.dashboard.program.right' }],
};

module.exports = {
  pluginName,
  permissions,
  menuItems,
  widgets,
};
