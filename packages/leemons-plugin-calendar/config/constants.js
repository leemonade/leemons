const permissionsPrefix = 'plugins.calendar';

module.exports = {
  permissions: [
    {
      permissionName: `${permissionsPrefix}.calendar`,
      actions: ['view', 'admin'],
      localizationName: { es: 'Calendario', en: 'Calendar' },
    },
    {
      permissionName: `${permissionsPrefix}.calendar-configs`,
      actions: ['view', 'create', 'update', 'delete', 'admin'],
      localizationName: { es: 'Configurar calendario', en: 'Calendar setup' },
    },
    {
      permissionName: `${permissionsPrefix}.calendar-classroom`,
      actions: ['view', 'create', 'update', 'delete', 'admin'],
      localizationName: { es: 'Calendarios aula', en: 'Classroom calendars' },
    },
  ],
  menuItems: [
    {
      config: {
        key: 'calendar',
        iconSvg: '/public/assets/svgs/calendar.svg',
        activeIconSvg: '/public/assets/svgs/calendar.svg',
        url: '/private/calendar/home',
        label: { es: 'Calendario', en: 'Calendar' },
      },
      permissions: [
        {
          permissionName: `${permissionsPrefix}.calendar`,
          actionNames: ['view', 'admin'],
        },
      ],
    },
    {
      config: {
        key: 'kanban',
        iconSvg: '/public/calendar/plugin-kanban.svg',
        activeIconSvg: '/public/calendar/plugin-kanban-active.svg',
        url: '/private/calendar/kanban',
        label: { es: 'Kanban', en: 'Kanban' },
      },
      permissions: [
        {
          permissionName: `${permissionsPrefix}.calendar`,
          actionNames: ['view', 'admin'],
        },
      ],
    },
    {
      config: {
        key: 'calendar-config',
        parentKey: 'plugins.calendar.calendar',
        url: '/private/calendar/config',
        label: { es: 'Configuración calendario', en: 'Calendar setup' },
      },
      permissions: [
        {
          permissionName: `${permissionsPrefix}.calendar-configs`,
          actionNames: ['view', 'admin'],
        },
      ],
    },
    {
      config: {
        key: 'calendar-classroom',
        parentKey: 'plugins.calendar.calendar',
        url: '/calendar/config/classroom',
        label: { es: 'Calendarios', en: 'Calendars' },
      },
      permissions: [
        {
          permissionName: `${permissionsPrefix}.calendar-classroom`,
          actionNames: ['view', 'admin'],
        },
      ],
    },
  ],
  kanbanColumns: [
    {
      name: {
        es: 'PROXÍMOS',
        en: 'BACKLOG',
      },
      order: 1,
      isDone: false,
      isArchived: false,
      bgColor: '#a47dde',
    },
    {
      name: {
        es: 'TO DO',
        en: 'TO DO',
      },
      order: 2,
      isDone: false,
      isArchived: false,
      bgColor: '#7ddecf',
    },
    {
      name: {
        es: 'EN PROGRESO',
        en: 'IN PROGRESS',
      },
      order: 3,
      isDone: false,
      isArchived: false,
      bgColor: '#7d9fde',
    },
    {
      name: {
        es: 'FINALIZADO',
        en: 'DONE',
      },
      order: 4,
      isDone: true,
      isArchived: false,
      bgColor: '#83de7d',
    },
    {
      name: {
        es: 'ARCHIVADO',
        en: 'ARCHIVED',
      },
      order: 5,
      isDone: false,
      isArchived: true,
      bgColor: '#a1a1a1',
    },
  ],
  widgets: {
    items: [
      {
        zoneKey: 'plugins.dashboard.program.left',
        key: `${permissionsPrefix}.user.program.calendar`,
        url: 'user-program-calendar/index',
      },
    ],
  },
};
