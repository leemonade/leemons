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
      iconSvg: '/public/leebrary/menu-icon.svg',
      activeIconSvg: '/public/leebrary/menu-icon.svg',
      url: '/private/leebrary/',
      label: {
        en: 'Library',
        es: 'Library',
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
    provider: 'leebrary',
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
    canAssign: [],
    canUnassign: [],
  },
  noPermission: {
    view: false,
    comment: false,
    edit: false,
    delete: false,
    canAssign: [],
    canUnassign: [],
  },
  viewer: {
    view: true,
    comment: false,
    edit: false,
    delete: false,
    canAssign: ['viewer'],
    canUnassign: [],
  },
  commentor: {
    view: true,
    comment: true,
    edit: false,
    delete: false,
    canAssign: ['viewer', 'commentor'],
    canUnassign: ['viewer'],
  },
  editor: {
    view: true,
    comment: true,
    edit: true,
    delete: false,
    canAssign: ['viewer', 'commentor', 'editor'],
    canUnassign: ['viewer', 'commentor'],
  },
  owner: {
    view: true,
    comment: true,
    edit: true,
    delete: true,
    canAssign: ['viewer', 'commentor', 'editor', 'owner'],
    canUnassign: ['viewer', 'commentor', 'editor'],
  },
};

const widgets = {
  zones: [
    { key: `${permissionsPrefix}.list.card` },
    { key: `${permissionsPrefix}.list.item` },
    { key: `${permissionsPrefix}.detail` },
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
