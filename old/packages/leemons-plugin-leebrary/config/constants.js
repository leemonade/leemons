const permissionsPrefix = 'plugins.leebrary';

const permissionNames = {
  library: `${permissionsPrefix}.library`,
};

const permissions = [
  {
    permissionName: permissionNames.library,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: { es: 'Library', en: 'Library' },
  },
];

const permissionsBundles = {
  library: {
    view: {
      permission: permissionNames.library,
      actions: ['view', 'admin'],
    },
    create: {
      permission: permissionNames.library,
      actions: ['create', 'admin'],
    },
    update: {
      permission: permissionNames.library,
      actions: ['update', 'admin'],
    },
    delete: {
      permission: permissionNames.library,
      actions: ['delete', 'admin'],
    },
  },
};

const menuItems = [
  {
    item: {
      key: 'library',
      order: 400,
      iconSvg: '/public/leebrary/menu-icon.svg',
      activeIconSvg: '/public/leebrary/menu-icon.svg',
      url: '/private/leebrary/',
      label: {
        en: 'Library',
        es: 'Librería',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.library,
        actionNames: ['view', 'update', 'create', 'delete', 'admin'],
      },
    ],
  },
];

const categoriesMenu = {
  key: `${permissionsPrefix}.categories`,
  permissions: [
    {
      permissionName: permissionNames.library,
      actionNames: ['view', 'update', 'create', 'delete', 'admin'],
    },
  ],
};

const CATEGORIES = {
  BOOKMARKS: 'bookmarks',
  MEDIA_FILES: 'media-files',
};

const categories = [
  {
    key: CATEGORIES.MEDIA_FILES,
    creatable: true,
    duplicable: true,
    provider: 'leebrary',
    canUse: '*',
    order: 2,
    menu: {
      item: {
        iconSvg: '/public/leebrary/media-files.svg',
        activeIconSvg: '/public/leebrary/media-files.svg',
        label: {
          en: 'Media files',
          es: 'Archivos multimedia',
        },
      },
      permissions: [
        {
          permissionName: permissionNames.library,
          actionNames: ['view', 'update', 'create', 'delete', 'admin'],
        },
      ],
    },
  },
  {
    key: CATEGORIES.BOOKMARKS,
    creatable: true,
    duplicable: true,
    provider: 'leebrary',
    canUse: '*',
    order: 3,
    menu: {
      item: {
        iconSvg: '/public/leebrary/bookmarks.svg',
        activeIconSvg: '/public/leebrary/bookmarks.svg',
        label: {
          en: 'Bookmarks',
          es: 'Marcadores',
        },
      },
      permissions: [
        {
          permissionName: permissionNames.library,
          actionNames: ['view', 'update', 'create', 'delete', 'admin'],
        },
      ],
    },
  },
];

// EN: The roles must be ordered by allowance. Each role can only assign lower roles.
// ES: Los roles deben estar ordenados por permisos. Cada rol sólo puede asignar roles inferiores.
const assetRoles = ['viewer', 'commentor', 'editor', 'owner'];
const roles = ['public', 'noPermission', ...assetRoles];

// EN: The permissions each role has.
// ES: Los permisos que cada rol tiene.
const rolesPermissions = {
  public: {
    view: true,
    comment: false,
    edit: false,
    delete: false,
    duplicate: true,
    canAssign: [],
    canUnassign: [],
  },
  noPermission: {
    view: false,
    comment: false,
    edit: false,
    delete: false,
    duplicate: false,
    canAssign: [],
    canUnassign: [],
  },
  viewer: {
    view: true,
    comment: false,
    edit: false,
    delete: false,
    duplicate: true,
    canAssign: ['viewer'],
    canUnassign: [],
  },
  commentor: {
    view: true,
    comment: true,
    edit: false,
    delete: false,
    duplicate: true,
    canAssign: ['viewer', 'commentor'],
    canUnassign: ['viewer'],
  },
  editor: {
    view: true,
    comment: true,
    edit: true,
    delete: false,
    duplicate: true,
    canAssign: ['viewer', 'commentor', 'editor'],
    canUnassign: ['viewer', 'commentor'],
  },
  owner: {
    view: true,
    comment: true,
    edit: true,
    delete: true,
    duplicate: true,
    canAssign: ['viewer', 'commentor', 'editor', 'owner'],
    canUnassign: ['viewer', 'commentor', 'editor'],
  },
};

const widgets = {
  zones: [{ key: `${permissionsPrefix}.admin.config-providers` }],
  items: [
    {
      zoneKey: `plugins.admin.admin-page`,
      key: `${permissionsPrefix}.admin.config`,
      url: 'admin-config/index',
      properties: {
        card: {
          headerColor: '#EEEAF7',
          title: `${permissionsPrefix}.admin.card.title`,
          image: '',
          imageWidth: 0,
          imageHeight: 0,
          description: `${permissionsPrefix}.admin.card.description`,
        },
      },
    },
  ],
};

module.exports = {
  roles,
  assetRoles,
  rolesPermissions,
  pluginName: permissionsPrefix,
  permissions: {
    permissions,
    names: permissionNames,
    bundles: permissionsBundles,
  },
  menuItems,
  categories,
  categoriesMenu,
  CATEGORIES,
  permissionSeparator: '(ASSET_ID)',
  widgets,
};
