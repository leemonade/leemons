module.exports = {
  permissions: [
    {
      permissionName: 'plugins.calendar.calendar',
      actions: ['view', 'admin'],
      localizationName: { es: 'Calendario', en: 'Calendar' },
    },
  ],
  menuItems: [
    {
      config: {
        key: 'calendar',
        iconSvg: '/assets/svgs/calendar.svg',
        activeIconSvg: '/assets/svgs/calendar.svg',
        url: '/calendar',
        label: { es: 'Calendario', en: 'Calendar' },
      },
      permissions: [
        {
          permissionName: 'plugins.calendar.calendar',
          actionNames: ['view', 'admin'],
        },
      ],
    },
  ],
};
