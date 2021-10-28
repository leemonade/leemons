module.exports = {
  permissions: [
    {
      permissionName: 'plugins.calendar.calendar',
      actions: ['view', 'admin'],
      localizationName: { es: 'Calendario', en: 'Calendar' },
    },
    {
      permissionName: 'plugins.calendar.calendar-configs',
      actions: ['view', 'create', 'update', 'delete', 'admin'],
      localizationName: { es: 'Configurar calendario', en: 'Calendar setup' },
    },
  ],
};
