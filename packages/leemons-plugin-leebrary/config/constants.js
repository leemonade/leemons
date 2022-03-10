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
      url: '/private/leebrary/home',
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

// EN: The roles must be ordered by allowance. Each role can only assign lower roles.
// ES: Los roles deben estar ordenados por permisos. Cada rol sólo puede asignar roles inferiores.
const roles = ['public', 'noPermission', 'viewer', 'commentor', 'editor', 'owner'];

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

module.exports = {
  roles,
  rolesPermissions,
  pluginName: permissionsPrefix,
  permissions: {
    permissions,
    names: permissionNames,
    bundles: permissionsBundles,
  },
  menuItems,
};
