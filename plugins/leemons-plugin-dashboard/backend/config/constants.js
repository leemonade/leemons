const pluginName = 'dashboard';

const permissions = [];

const menuItems = [
  {
    item: {
      key: 'dashboard',
      order: 1,
      iconSvg: '/public/dashboard/menu-icon.svg',
      activeIconSvg: '/public/dashboard/menu-icon.svg',
      url: '/private/dashboard',
      label: {
        en: 'Home',
        es: 'Inicio',
      },
    },
  },
];

const widgets = {
  zones: [
    { key: 'dashboard.program.left' },
    { key: 'dashboard.program.right' },
    { key: 'dashboard.class.tabs' },
    { key: 'dashboard.class.right-tabs' },
    { key: 'dashboard.class.header-bar' },
    // { key: 'dashboard.class.control-panel' },
  ],
  items: [
    // {
    //   zoneKey: 'dashboard.class.tabs',
    //   key: `dashboard.class.tab.control-panel`,
    //   url: 'tab-control-panel/index',
    //   properties: {
    //     label: 'dashboard.tabControlPanel.label',
    //   },
    // },
    {
      zoneKey: `dashboard.program.left`,
      key: `${pluginName}.dashboard.welcome`,
      url: 'dashboard/welcome',
    },
    {
      zoneKey: `assignables.class.ongoing`,
      key: `${pluginName}.dashboard.class.welcome`,
      url: 'dashboard/welcome',
    },
  ],
};

module.exports = {
  pluginName,
  permissions,
  menuItems,
  widgets,
};
