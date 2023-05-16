const pluginName = 'plugins.dashboard';

const permissions = [];

const menuItems = [
  {
    config: {
      key: 'dashboard',
      order: 1,
      iconSvg: '/public/dashboard/menu-icon.svg',
      activeIconSvg: '/public/dashboard/menu-icon.svg',
      url: '/private/dashboard',
      label: {
        en: 'Dashboard',
        es: 'Panel de control',
      },
    },
  },
];

const widgets = {
  zones: [
    { key: 'plugins.dashboard.program.left' },
    { key: 'plugins.dashboard.program.right' },
    { key: 'plugins.dashboard.class.tabs' },
    { key: 'plugins.dashboard.class.right-tabs' },
    { key: 'plugins.dashboard.class.header-bar' },
    // { key: 'plugins.dashboard.class.control-panel' },
  ],
  items: [
    // {
    //   zoneKey: 'plugins.dashboard.class.tabs',
    //   key: `plugins.dashboard.class.tab.control-panel`,
    //   url: 'tab-control-panel/index',
    //   properties: {
    //     label: 'plugins.dashboard.tabControlPanel.label',
    //   },
    // },
  ],
};

module.exports = {
  pluginName,
  permissions,
  menuItems,
  widgets,
};
