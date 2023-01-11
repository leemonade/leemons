const permissionsPrefix = 'plugins.calendar';

module.exports = {
  permissions: [
    {
      permissionName: `${permissionsPrefix}.calendar`,
      actions: ['view', 'update', 'admin'],
      localizationName: { es: 'Calendario', en: 'Calendar' },
    },
    {
      permissionName: `${permissionsPrefix}.menu.kanban`,
      actions: ['view'],
      localizationName: { es: 'Menu Kanban', en: 'Menu Kanban' },
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
        order: 200,
        iconSvg: '/public/calendar/calendar.svg',
        activeIconSvg: '/public/calendar/calendar.svg',
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
        order: 201,
        iconSvg: '/public/calendar/plugin-kanban.svg',
        activeIconSvg: '/public/calendar/plugin-kanban-active.svg',
        url: '/private/calendar/kanban',
        label: { es: 'Kanban', en: 'Kanban' },
      },
      permissions: [
        {
          permissionName: `${permissionsPrefix}.menu.kanban`,
          actionNames: ['view'],
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
        es: 'Sin estado',
        en: 'Backlog',
      },
      order: 1,
      isDone: false,
      isArchived: false,
      bgColor: '#a47dde',
    },
    {
      name: {
        es: 'Por hacer',
        en: 'To do',
      },
      order: 2,
      isDone: false,
      isArchived: false,
      bgColor: '#7ddecf',
    },
    {
      name: {
        es: 'En progreso',
        en: 'In progress',
      },
      order: 3,
      isDone: false,
      isArchived: false,
      bgColor: '#7d9fde',
    },
    {
      name: {
        es: 'En revisión',
        en: 'Under review',
      },
      order: 4,
      isDone: false,
      isArchived: false,
      bgColor: '#83de7d',
    },
    {
      name: {
        es: 'Finalizado',
        en: 'Done',
      },
      order: 5,
      isDone: true,
      isArchived: false,
      bgColor: '#83de7d',
    },
    {
      name: {
        es: 'ARCHIVADO',
        en: 'ARCHIVED',
      },
      order: 6,
      isDone: false,
      isArchived: true,
      bgColor: '#a1a1a1',
    },
  ],
  widgets: {
    zones: [
      { key: `${permissionsPrefix}.class.kanban` },
      { key: `${permissionsPrefix}.class.calendar` },
    ],
    items: [
      // ---- Dashboard
      {
        zoneKey: 'plugins.dashboard.program.left',
        key: `${permissionsPrefix}.user.program.calendar`,
        url: 'user-program-calendar/index',
      },
      {
        zoneKey: 'plugins.dashboard.program.left',
        key: `${permissionsPrefix}.user.program.kanban`,
        url: 'user-program-kanban/index',
      },
      // ---- Class (Control Panel)
      // {
      //   zoneKey: 'plugins.dashboard.class.control-panel',
      //   key: `${permissionsPrefix}.user.class.calendar`,
      //   url: 'user-program-calendar/index',
      // },
      // {
      //   zoneKey: 'plugins.dashboard.class.control-panel',
      //   key: `${permissionsPrefix}.user.class.kanban`,
      //   url: 'user-program-kanban/index',
      // },
      // ---- Class (Kanban)
      {
        zoneKey: `${permissionsPrefix}.class.kanban`,
        key: `${permissionsPrefix}.user.class.kanban.kanban`,
        url: 'user-program-kanban/index',
        properties: {
          useAllColumns: true,
        },
      },
      // ---- Class (Calendar)
      {
        zoneKey: `${permissionsPrefix}.class.calendar`,
        key: `${permissionsPrefix}.user.class.calendar.calendar`,
        url: 'user-program-calendar/index',
      },
      // ---- Class (Kanban [Tab])
      {
        zoneKey: 'plugins.dashboard.class.tabs',
        key: `${permissionsPrefix}.class.tab.kanban`,
        url: 'tab-kanban/index',
        properties: {
          label: `${permissionsPrefix}.tabKanban.label`,
        },
      },
      // ---- Class (Calendar [Tab])
      {
        zoneKey: 'plugins.dashboard.class.tabs',
        key: `${permissionsPrefix}.class.tab.calendar`,
        url: 'tab-calendar/index',
        properties: {
          label: `${permissionsPrefix}.tabCalendar.label`,
        },
      },
    ],
  },
};
